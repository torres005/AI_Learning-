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

export const parentRouter = createRouter({
  getDashboard: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user || user.role !== "parent") throw new Error("Unauthorized");

    const links = await db.select().from(schema.parentChildLinks)
      .where(and(eq(schema.parentChildLinks.parentId, user.userId), eq(schema.parentChildLinks.status, "accepted")));

    const children = [];
    for (const link of links) {
      const childUser = await db.select().from(schema.users).where(eq(schema.users.id, link.childId)).limit(1);
      const childProfile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, link.childId)).limit(1);
      if (childUser.length > 0) {
        const cp = childProfile[0];
        children.push({
          id: childUser[0].id,
          name: childUser[0].fullName,
          avatar: childUser[0].avatar || cp?.selectedAvatar || "/child-avatar-1.png",
          level: cp?.level || 1,
          xp: cp?.totalXp || 0,
          streak: cp?.currentStreak || 0,
        });
      }
    }

    return { children };
  }),

  getChildProgress: publicQuery
    .input(z.object({ childId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "parent") throw new Error("Unauthorized");

      // Verify link
      const link = await db.select().from(schema.parentChildLinks)
        .where(and(eq(schema.parentChildLinks.parentId, user.userId), eq(schema.parentChildLinks.childId, input.childId), eq(schema.parentChildLinks.status, "accepted")))
        .limit(1);
      if (link.length === 0) throw new Error("Not linked to this child");

      const courseProg = await db.select().from(schema.courseProgress).where(eq(schema.courseProgress.childId, input.childId));
      const progress = [];
      for (const cp of courseProg) {
        const course = await db.select().from(schema.courses).where(eq(schema.courses.id, cp.courseId)).limit(1);
        if (course.length > 0) {
          progress.push({
            course: course[0],
            progress: Math.min(Math.round((cp.completedLessons / cp.totalLessons) * 100), 100),
            status: cp.status
          });
        }
      }

      const childProfile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, input.childId)).limit(1);

      return { progress, stats: childProfile[0] || null };
    }),

  linkChild: publicQuery
    .input(z.object({ childUsername: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "parent") throw new Error("Unauthorized");

      const childUsers = await db.select().from(schema.users).where(eq(schema.users.username, input.childUsername)).limit(1);
      if (childUsers.length === 0) throw new Error("Child not found");
      const child = childUsers[0];
      if (child.role !== "child") throw new Error("User is not a child");

      const result = await db.insert(schema.parentChildLinks).values({
        parentId: user.userId,
        childId: child.id,
        status: "accepted",
      });

      return { linkId: Number(result[0].insertId) };
    }),

  acceptLink: publicQuery
    .input(z.object({ linkId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user) throw new Error("Unauthorized");

      await db.update(schema.parentChildLinks)
        .set({ status: "accepted" })
        .where(eq(schema.parentChildLinks.id, input.linkId));

      return { success: true };
    }),

  getReports: publicQuery
    .input(z.object({ childId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "parent") throw new Error("Unauthorized");

      const link = await db.select().from(schema.parentChildLinks)
        .where(and(eq(schema.parentChildLinks.parentId, user.userId), eq(schema.parentChildLinks.childId, input.childId), eq(schema.parentChildLinks.status, "accepted")))
        .limit(1);
      if (link.length === 0) throw new Error("Not linked");

      const profile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, input.childId)).limit(1);
      const cp = await db.select().from(schema.courseProgress).where(eq(schema.courseProgress.childId, input.childId));
      const badges = await db.select().from(schema.childBadges).where(eq(schema.childBadges.childId, input.childId));
      const _streakLogs = await db.select().from(schema.streakLogs).where(eq(schema.streakLogs.childId, input.childId));

      const totalTime = _streakLogs.reduce((sum: number) => sum + 10, 0); // estimate
      const lessonsCompleted = cp.reduce((sum: number, c: any) => sum + Math.min(c.completedLessons, c.totalLessons), 0);

      return {
        summary: {
          totalTime,
          lessonsCompleted,
          xpEarned: profile[0]?.totalXp || 0,
          badgesEarned: badges.length,
          streak: profile[0]?.currentStreak || 0,
          level: profile[0]?.level || 1,
        },
        courseProgress: cp,
      };
    }),
});
