import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.APP_SECRET || "your-secret-key";

function getUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { userId: number; role: string };
  } catch { return null; }
}

export const homeworkRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user) throw new Error("Unauthorized");

    if (user.role === "teacher") {
      const hw = await db.select().from(schema.homework).where(eq(schema.homework.teacherId, user.userId));
      return { homework: hw };
    } else if (user.role === "child") {
      // Get homework for classrooms this student is in
      const csList = await db.select().from(schema.classroomStudents).where(eq(schema.classroomStudents.studentId, user.userId));
      const classroomIds = csList.map((cs: any) => cs.classroomId);
      const allHw = await db.select().from(schema.homework);
      const studentHw = allHw.filter((h: any) => classroomIds.includes(h.classroomId));

      // Get submission status
      const submissions = await db.select().from(schema.homeworkSubmissions).where(eq(schema.homeworkSubmissions.studentId, user.userId));
      const submittedIds = new Set(submissions.map((s: any) => s.homeworkId));

      return { homework: studentHw.map((h: any) => ({ ...h, submitted: submittedIds.has(h.id) })) };
    }
    return { homework: [] };
  }),

  create: publicQuery
    .input(z.object({
      classroomId: z.number(),
      title: z.string(),
      description: z.string(),
      subject: z.string(),
      dueDate: z.string().transform((s) => new Date(s)),
      xpReward: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "teacher") throw new Error("Unauthorized");

      const result = await db.insert(schema.homework).values({
        teacherId: user.userId,
        classroomId: input.classroomId,
        title: input.title,
        description: input.description,
        subject: input.subject,
        dueDate: input.dueDate,
        xpReward: input.xpReward,
      });

      return { homeworkId: Number(result[0].insertId) };
    }),

  submit: publicQuery
    .input(z.object({
      homeworkId: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "child") throw new Error("Unauthorized");

      const result = await db.insert(schema.homeworkSubmissions).values({
        homeworkId: input.homeworkId,
        studentId: user.userId,
        content: input.content,
      });

      return { submissionId: Number(result[0].insertId) };
    }),

  getSubmissions: publicQuery
    .input(z.object({ homeworkId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "teacher") throw new Error("Unauthorized");

      const submissions = await db.select().from(schema.homeworkSubmissions).where(eq(schema.homeworkSubmissions.homeworkId, input.homeworkId));
      const result = [];
      for (const sub of submissions) {
        const su = await db.select().from(schema.users).where(eq(schema.users.id, sub.studentId)).limit(1);
        result.push({ ...sub, studentName: su[0]?.fullName || "Unknown" });
      }
      return { submissions: result };
    }),

  grade: publicQuery
    .input(z.object({
      submissionId: z.number(),
      grade: z.string(),
      feedback: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "teacher") throw new Error("Unauthorized");

      await db.update(schema.homeworkSubmissions)
        .set({ grade: input.grade, feedback: input.feedback, status: "graded", gradedAt: new Date() })
        .where(eq(schema.homeworkSubmissions.id, input.submissionId));

      // Award XP to student
      const sub = await db.select().from(schema.homeworkSubmissions).where(eq(schema.homeworkSubmissions.id, input.submissionId)).limit(1);
      if (sub.length > 0) {
        const hw = await db.select().from(schema.homework).where(eq(schema.homework.id, sub[0].homeworkId)).limit(1);
        if (hw.length > 0) {
          const profile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, sub[0].studentId)).limit(1);
          if (profile.length > 0) {
            const newXp = profile[0].totalXp + hw[0].xpReward;
            await db.update(schema.childrenProfiles)
              .set({ totalXp: newXp, level: Math.floor(newXp / 500) + 1 })
              .where(eq(schema.childrenProfiles.id, profile[0].id));
          }
        }
      }

      return { success: true };
    }),
});
