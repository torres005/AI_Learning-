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

export const taskRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const user = getUser(ctx.req);
    if (!user) throw new Error("Unauthorized");

    if (user.role === "parent") {
      const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.parentId, user.userId));
      return { tasks };
    } else if (user.role === "child") {
      const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.childId, user.userId));
      return { tasks };
    }
    return { tasks: [] };
  }),

  create: publicQuery
    .input(z.object({
      childId: z.number(),
      title: z.string(),
      description: z.string(),
      subject: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      dueDate: z.string().transform((s) => new Date(s)),
      xpReward: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user || user.role !== "parent") throw new Error("Unauthorized");

      const result = await db.insert(schema.tasks).values({
        parentId: user.userId,
        childId: input.childId,
        title: input.title,
        description: input.description,
        subject: input.subject,
        difficulty: input.difficulty,
        dueDate: input.dueDate,
        xpReward: input.xpReward,
      });

      return { taskId: Number(result[0].insertId) };
    }),

  updateStatus: publicQuery
    .input(z.object({ taskId: z.number(), status: z.enum(["pending", "in_progress", "completed", "confirmed"]) }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const user = getUser(ctx.req);
      if (!user) throw new Error("Unauthorized");

      await db.update(schema.tasks)
        .set({ status: input.status })
        .where(eq(schema.tasks.id, input.taskId));

      // If confirmed, award XP to child
      if (input.status === "confirmed") {
        const task = await db.select().from(schema.tasks).where(eq(schema.tasks.id, input.taskId)).limit(1);
        if (task.length > 0) {
          const profile = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, task[0].childId)).limit(1);
          if (profile.length > 0) {
            const newXp = profile[0].totalXp + task[0].xpReward;
            await db.update(schema.childrenProfiles)
              .set({ totalXp: newXp, level: Math.floor(newXp / 500) + 1 })
              .where(eq(schema.childrenProfiles.id, profile[0].id));
          }
        }
      }

      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(schema.tasks).where(eq(schema.tasks.id, input.taskId));
      return { success: true };
    }),
});
