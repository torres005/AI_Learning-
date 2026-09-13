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

export const childRouter = createRouter({
  getDashboard: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "child") throw new Error("Unauthorized");

    // Profile
    const profiles = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, user.userId)).limit(1);
    const profile = profiles[0];

    // Stats
    const stats = {
      streak: profile?.currentStreak || 0,
      totalXp: profile?.totalXp || 0,
      badgesEarned: 0,
      coursesCompleted: 0,
      level: profile?.level || 1,
    };

    // Count badges
    const badges = await db.select().from(schema.childBadges).where(eq(schema.childBadges.childId, user.userId));
    stats.badgesEarned = badges.length;

    // Count completed courses
    const completed = await db.select().from(schema.courseProgress)
      .where(eq(schema.courseProgress.childId, user.userId));
    stats.coursesCompleted = completed.filter((c: any) => c.status === "completed").length;

    // In-progress courses with course data
    const inProgressCourses = [];
    for (const cp of completed.filter((c: any) => c.status === "in_progress")) {
      const courseData = await db.select().from(schema.courses).where(eq(schema.courses.id, cp.courseId)).limit(1);
      if (courseData.length > 0) {
        inProgressCourses.push({
          ...courseData[0],
          progress: Math.min(Math.round((cp.completedLessons / cp.totalLessons) * 100), 100),
          completedLessons: Math.min(cp.completedLessons, cp.totalLessons),
          totalLessons: cp.totalLessons,
        });
      }
    }

    // Recent achievements (earned badges)
    const recentBadges = [];
    const childBadges = await db.select().from(schema.childBadges).where(eq(schema.childBadges.childId, user.userId)).orderBy(schema.childBadges.earnedAt);
    const recent = childBadges.slice(-4);
    for (const cb of recent) {
      const badgeData = await db.select().from(schema.badges).where(eq(schema.badges.id, cb.badgeId)).limit(1);
      if (badgeData.length > 0) recentBadges.push(badgeData[0]);
    }

    // Streak calendar (last 28 days)
    const calendar = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const logs = await db.select().from(schema.streakLogs)
        .where(eq(schema.streakLogs.childId, user.userId))
        .limit(1);
      const hasLog = logs.some((l: any) => l.date.toISOString().split("T")[0] === dateStr);
      calendar.push({ date: dateStr, completed: hasLog, isToday: i === 0 });
    }

    return { profile, stats, inProgressCourses, recentAchievements: recentBadges, streakCalendar: calendar };
  }),

  getAchievements: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "child") throw new Error("Unauthorized");

    const allBadges = await db.select().from(schema.badges);
    const earnedBadges = await db.select().from(schema.childBadges).where(eq(schema.childBadges.childId, user.userId));
    const earnedIds = new Set(earnedBadges.map((b: any) => b.badgeId));

    const profile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, user.userId)).limit(1);
    const totalXp = profile[0]?.totalXp || 0;
    const level = profile[0]?.level || 1;
    const nextLevelXp = level * 500;

    return {
      badges: allBadges.map((b: any) => ({ ...b, earned: earnedIds.has(b.id) })),
      totalXp,
      level,
      nextLevelXp,
    };
  }),
});
