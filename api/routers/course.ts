import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.APP_SECRET || "your-secret-key";

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { userId: number; role: string };
  } catch {
    return null;
  }
}

export const courseRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        ageGroup: z.enum(["5-8", "8-12", "12-16"]).optional(),
        category: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(schema.courses);
      
      if (input?.ageGroup) {
        // Can't chain where with drizzle mysql, use filter
        const all = await query;
        return {
          courses: all.filter((c: any) => {
            if (input.ageGroup && c.ageGroup !== input.ageGroup) return false;
            if (input.category && c.category !== input.category) return false;
            return true;
          }),
        };
      }
      
      const all = await query;
      return { courses: all };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUserFromToken(ctx.req);
      
      const courses = await db.select().from(schema.courses).where(eq(schema.courses.id, input.id)).limit(1);
      if (courses.length === 0) throw new Error("Course not found");
      const course = courses[0];

      const lessonsList = await db.select().from(schema.lessons).where(eq(schema.lessons.courseId, input.id)).orderBy(schema.lessons.order);

      let progress = null;
      let lessonStatuses: Record<number, string> = {};
      
      if (user?.role === "child") {
        const cp = await db.select().from(schema.courseProgress)
          .where(and(eq(schema.courseProgress.childId, user.userId), eq(schema.courseProgress.courseId, input.id))).limit(1);
        progress = cp[0] || null;

        // Get lesson progress
        const lp = await db.select().from(schema.lessonProgress).where(eq(schema.lessonProgress.childId, user.userId));
        for (const l of lp) {
          lessonStatuses[l.lessonId] = l.status;
        }

        // If not started, all lessons locked except first
        if (!progress) {
          for (const lesson of lessonsList) {
            lessonStatuses[lesson.id] = lesson.order === 1 ? "unlocked" : "locked";
          }
        }
      }

      return { course, lessons: lessonsList, progress, lessonStatuses };
    }),

  start: publicQuery
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUserFromToken(ctx.req);
      if (!user || user.role !== "child") throw new Error("Unauthorized");

      const existing = await db.select().from(schema.courseProgress)
        .where(and(eq(schema.courseProgress.childId, user.userId), eq(schema.courseProgress.courseId, input.courseId))).limit(1);

      if (existing.length > 0) return { success: true, alreadyStarted: true };

      const lessonsList = await db.select().from(schema.lessons).where(eq(schema.lessons.courseId, input.courseId));

      await db.insert(schema.courseProgress).values({
        childId: user.userId,
        courseId: input.courseId,
        completedLessons: 0,
        totalLessons: lessonsList.length,
        status: "in_progress",
        startedAt: new Date(),
      });

      // Unlock first lesson
      if (lessonsList.length > 0) {
        const firstLesson = lessonsList.sort((a: any, b: any) => a.order - b.order)[0];
        await db.insert(schema.lessonProgress).values({
          childId: user.userId,
          lessonId: firstLesson.id,
          status: "unlocked",
        }).onDuplicateKeyUpdate({ set: { status: "unlocked" } });
      }

      return { success: true };
    }),

  getProgress: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUserFromToken(ctx.req);
    if (!user || user.role !== "child") return { courses: [] };

    const progress = await db.select().from(schema.courseProgress).where(eq(schema.courseProgress.childId, user.userId));
    return { courses: progress };
  }),
});
