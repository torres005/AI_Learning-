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

export const teacherRouter = createRouter({
  getDashboard: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "teacher") throw new Error("Unauthorized");

    const classrooms = await db.select().from(schema.classrooms).where(eq(schema.classrooms.teacherId, user.userId));
    const classroomList = [];
    for (const cls of classrooms) {
      const students = await db.select().from(schema.classroomStudents).where(eq(schema.classroomStudents.classroomId, cls.id));
      classroomList.push({ ...cls, studentCount: students.length });
    }

    // Get all students in teacher's classrooms
    const allStudents = [];
    for (const cls of classrooms) {
      const csList = await db.select().from(schema.classroomStudents).where(eq(schema.classroomStudents.classroomId, cls.id));
      for (const cs of csList) {
        const su = await db.select().from(schema.users).where(eq(schema.users.id, cs.studentId)).limit(1);
        const sp = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, cs.studentId)).limit(1);
        if (su.length > 0) {
          allStudents.push({
            id: su[0].id,
            name: su[0].fullName,
            avatar: su[0].avatar || sp[0]?.selectedAvatar || "/child-avatar-1.png",
            ageGroup: sp[0]?.ageGroup || "8-12",
            level: sp[0]?.level || 1,
            xp: sp[0]?.totalXp || 0,
            streak: sp[0]?.currentStreak || 0,
          });
        }
      }
    }

    return { classrooms: classroomList, students: allStudents, stats: { totalStudents: allStudents.length } };
  }),

  createClassroom: publicQuery
    .input(z.object({ name: z.string(), subject: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "teacher") throw new Error("Unauthorized");

      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const result = await db.insert(schema.classrooms).values({
        teacherId: user.userId,
        name: input.name,
        subject: input.subject,
        joinCode: code,
      });

      return { classroomId: Number(result[0].insertId), joinCode: code };
    }),

  getClassrooms: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "teacher") return { classrooms: [] };

    const classrooms = await db.select().from(schema.classrooms).where(eq(schema.classrooms.teacherId, user.userId));
    const result = [];
    for (const cls of classrooms) {
      const students = await db.select().from(schema.classroomStudents).where(eq(schema.classroomStudents.classroomId, cls.id));
      result.push({ ...cls, studentCount: students.length });
    }
    return { classrooms: result };
  }),

  getStudentDetail: publicQuery
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "teacher") throw new Error("Unauthorized");

      const su = await db.select().from(schema.users).where(eq(schema.users.id, input.studentId)).limit(1);
      const sp = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, input.studentId)).limit(1);
      
      const courseProg = await db.select().from(schema.courseProgress).where(eq(schema.courseProgress.childId, input.studentId));
      const courses = [];
      for (const cp of courseProg) {
        const c = await db.select().from(schema.courses).where(eq(schema.courses.id, cp.courseId)).limit(1);
        if (c.length > 0) {
          courses.push({
            course: c[0],
            progress: Math.min(Math.round((cp.completedLessons / cp.totalLessons) * 100), 100),
            status: cp.status
          });
        }
      }

      return {
        student: su[0] || null,
        profile: sp[0] || null,
        courses,
      };
    }),

  joinClassroom: publicQuery
    .input(z.object({ joinCode: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "child") throw new Error("Only children can join classrooms");

      const classrooms = await db.select().from(schema.classrooms).where(eq(schema.classrooms.joinCode, input.joinCode.toUpperCase())).limit(1);
      if (classrooms.length === 0) throw new Error("Invalid join code");

      await db.insert(schema.classroomStudents).values({
        classroomId: classrooms[0].id,
        studentId: user.userId,
      }).onDuplicateKeyUpdate({ set: { classroomId: classrooms[0].id } });

      return { success: true, classroomName: classrooms[0].name };
    }),
});
