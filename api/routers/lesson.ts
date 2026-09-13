import { z } from "zod";
import { eq, and } from "drizzle-orm";
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

export const lessonRouter = createRouter({
  complete: publicQuery
    .input(z.object({ lessonId: z.number(), score: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "child") throw new Error("Unauthorized");

      // Get lesson info
      const lessons = await db.select().from(schema.lessons).where(eq(schema.lessons.id, input.lessonId)).limit(1);
      if (lessons.length === 0) throw new Error("Lesson not found");
      const lesson = lessons[0];

      // Check if lesson was already completed
      const existingProgress = await db.select().from(schema.lessonProgress)
        .where(and(
          eq(schema.lessonProgress.childId, user.userId),
          eq(schema.lessonProgress.lessonId, input.lessonId)
        )).limit(1);
      const isAlreadyCompleted = existingProgress.length > 0 && existingProgress[0].status === "completed";

      // Mark lesson complete
      await db.insert(schema.lessonProgress).values({
        childId: user.userId,
        lessonId: input.lessonId,
        status: "completed",
        completedAt: new Date(),
        score: input.score || null,
      }).onDuplicateKeyUpdate({
        set: { status: "completed", completedAt: new Date(), score: input.score || null },
      });

      // Update course progress
      const courseProgressList = await db.select().from(schema.courseProgress)
        .where(and(eq(schema.courseProgress.childId, user.userId), eq(schema.courseProgress.courseId, lesson.courseId))).limit(1);
      
      if (courseProgressList.length > 0) {
        const cp = courseProgressList[0];
        const newCompleted = isAlreadyCompleted 
          ? cp.completedLessons 
          : Math.min(cp.completedLessons + 1, cp.totalLessons);
        const status = newCompleted >= cp.totalLessons ? "completed" : "in_progress";
        
        await db.update(schema.courseProgress)
          .set({
            completedLessons: newCompleted,
            status,
            completedAt: status === "completed" ? new Date() : cp.completedAt,
          })
          .where(eq(schema.courseProgress.id, cp.id));
      }

      // Unlock next lesson
      const allLessons = await db.select().from(schema.lessons)
        .where(eq(schema.lessons.courseId, lesson.courseId))
        .orderBy(schema.lessons.order);
      
      const currentIndex = allLessons.findIndex((l: any) => l.id === input.lessonId);
      if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        await db.insert(schema.lessonProgress).values({
          childId: user.userId,
          lessonId: nextLesson.id,
          status: "unlocked",
        }).onDuplicateKeyUpdate({ set: { status: "unlocked" } });
      }

      // Update child XP
      const xpEarned = typeof lesson.xpReward === "number" ? lesson.xpReward : parseInt(lesson.xpReward as any) || 0;
      const profile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, user.userId)).limit(1);
      if (profile.length > 0) {
        const p = profile[0];
        const currentXp = isNaN(Number(p.totalXp)) ? 0 : Number(p.totalXp);
        const newXp = currentXp + xpEarned;
        const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);
        await db.update(schema.childrenProfiles)
          .set({ totalXp: newXp, level: newLevel })
          .where(eq(schema.childrenProfiles.id, p.id));
      }

      // Log streak
      const today = new Date();
      await db.insert(schema.streakLogs).values({
        childId: user.userId,
        date: today,
        activityType: "lesson_complete",
        xpEarned,
      }).onDuplicateKeyUpdate({ set: { xpEarned } });

      // Update streak
      if (profile.length > 0) {
        const p = profile[0];
        const yesterdayLog = await db.select().from(schema.streakLogs)
          .where(eq(schema.streakLogs.childId, user.userId))
          .limit(1);
        const hasYesterdayLog = yesterdayLog.some((l: any) => {
          const logDate = new Date(l.date);
          const yest = new Date();
          yest.setDate(yest.getDate() - 1);
          return logDate.toDateString() === yest.toDateString();
        });

        const currentStreak = isNaN(Number(p.currentStreak)) ? 0 : Number(p.currentStreak);
        const longestStreak = isNaN(Number(p.longestStreak)) ? 0 : Number(p.longestStreak);

        const newStreak = hasYesterdayLog ? currentStreak + 1 : 1;
        const newLongest = Math.max(newStreak, longestStreak);
        
        await db.update(schema.childrenProfiles)
          .set({ currentStreak: newStreak, longestStreak: newLongest })
          .where(eq(schema.childrenProfiles.id, p.id));
      }

      const pXp = profile.length > 0 ? (isNaN(Number(profile[0].totalXp)) ? 0 : Number(profile[0].totalXp)) : 0;
      const pLevel = profile.length > 0 ? (isNaN(Number(profile[0].level)) ? 1 : Number(profile[0].level)) : 1;

      return { 
        xpEarned, 
        levelUp: profile.length > 0 && Math.floor((pXp + xpEarned) / 500) + 1 > pLevel 
      };
    }),
});
