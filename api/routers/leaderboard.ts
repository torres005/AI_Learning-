import { z } from "zod";
import { eq, desc } from "drizzle-orm";
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

export const leaderboardRouter = createRouter({
  getGlobal: publicQuery.query(async () => {
    const db = getDb();
    
    // Fetch all children profiles
    const profiles = await db.select().from(schema.childrenProfiles).orderBy(desc(schema.childrenProfiles.totalXp));
    
    const leaderboard = [];
    for (const profile of profiles) {
      const userRows = await db.select().from(schema.users).where(eq(schema.users.id, profile.userId)).limit(1);
      if (userRows.length > 0) {
        leaderboard.push({
          userId: profile.userId,
          name: userRows[0].fullName,
          avatar: profile.selectedAvatar || userRows[0].avatar || "/child-avatar-1.png",
          level: profile.level,
          xp: profile.totalXp,
          streak: profile.currentStreak,
        });
      }
    }
    
    return { leaderboard: leaderboard.slice(0, 10) };
  }),

  getClassroom: publicQuery
    .input(z.object({ classroomId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user) throw new Error("Unauthorized");

      // Get classroom students
      const classroomStuds = await db.select().from(schema.classroomStudents).where(eq(schema.classroomStudents.classroomId, input.classroomId));
      
      const leaderboard = [];
      for (const cs of classroomStuds) {
        const profiles = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, cs.studentId)).limit(1);
        const userRows = await db.select().from(schema.users).where(eq(schema.users.id, cs.studentId)).limit(1);
        
        if (profiles.length > 0 && userRows.length > 0) {
          const profile = profiles[0];
          leaderboard.push({
            userId: profile.userId,
            name: userRows[0].fullName,
            avatar: profile.selectedAvatar || userRows[0].avatar || "/child-avatar-1.png",
            level: profile.level,
            xp: profile.totalXp,
            streak: profile.currentStreak,
          });
        }
      }
      
      // Sort by XP desc
      leaderboard.sort((a, b) => b.xp - a.xp);

      return { leaderboard };
    }),
});
