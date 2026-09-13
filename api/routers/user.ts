import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";

const JWT_SECRET = process.env.APP_SECRET || "your-secret-key";

export const userRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        role: z.enum(["child", "parent", "teacher"]),
        username: z.string().min(3).max(50),
        password: z.string().min(6),
        fullName: z.string().min(1),
        email: z.string().email().optional(),
        ageGroup: z.enum(["5-8", "8-12", "12-16"]).optional(),
        subject: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      
      // Check if username exists
      const existing = await db.select().from(schema.users).where(eq(schema.users.username, input.username)).limit(1);
      if (existing.length > 0) {
        throw new Error("Username already taken");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      
      const userData: schema.InsertUser = {
        username: input.username,
        passwordHash,
        fullName: input.fullName,
        email: input.email || null,
        role: input.role,
        avatar: input.avatar || null,
      };

      const result = await db.insert(schema.users).values(userData);
      const userId = Number(result[0].insertId);

      // Create role-specific profile
      if (input.role === "child") {
        await db.insert(schema.childrenProfiles).values({
          userId,
          ageGroup: input.ageGroup || "8-12",
          selectedAvatar: input.avatar || "/child-avatar-1.png",
        });
      } else if (input.role === "parent") {
        await db.insert(schema.parentProfiles).values({ userId });
      } else if (input.role === "teacher") {
        await db.insert(schema.teacherProfiles).values({
          userId,
          subject: input.subject || null,
        });
      }

      // Generate token
      const token = jwt.sign({ userId, role: input.role }, JWT_SECRET, { expiresIn: "30d" });

      return {
        user: { id: userId, username: input.username, role: input.role, fullName: input.fullName },
        token,
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      
      const users = await db.select().from(schema.users).where(eq(schema.users.username, input.username)).limit(1);
      if (users.length === 0) {
        throw new Error("Invalid username or password");
      }

      const user = users[0];
      if (!user.passwordHash) {
        throw new Error("Please use OAuth login");
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid username or password");
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });

      return {
        user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
        token,
      };
    }),

  getProfile: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const authHeader = ctx.req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.slice(7);
    let decoded: { userId: number; role: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    } catch {
      return null;
    }

    const users = await db.select().from(schema.users).where(eq(schema.users.id, decoded.userId)).limit(1);
    if (users.length === 0) return null;

    const user = users[0];
    let profile = null;

    if (user.role === "child") {
      const profiles = await db.select().from(schema.childrenProfiles).where(eq(schema.childrenProfiles.userId, user.id)).limit(1);
      profile = profiles[0] || null;
    } else if (user.role === "parent") {
      const profiles = await db.select().from(schema.parentProfiles).where(eq(schema.parentProfiles.userId, user.id)).limit(1);
      profile = profiles[0] || null;
    } else if (user.role === "teacher") {
      const profiles = await db.select().from(schema.teacherProfiles).where(eq(schema.teacherProfiles.userId, user.id)).limit(1);
      profile = profiles[0] || null;
    }

    return { user, profile };
  }),

  updateProfile: publicQuery
    .input(
      z.object({
        fullName: z.string().optional(),
        avatar: z.string().optional(),
        selectedAvatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const authHeader = ctx.req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

      const token = authHeader.slice(7);
      let decoded: { userId: number };
      try {
        decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      } catch {
        throw new Error("Unauthorized");
      }

      if (input.fullName) {
        await db.update(schema.users).set({ fullName: input.fullName }).where(eq(schema.users.id, decoded.userId));
      }
      if (input.avatar) {
        await db.update(schema.users).set({ avatar: input.avatar }).where(eq(schema.users.id, decoded.userId));
      }
      if (input.selectedAvatar) {
        await db.update(schema.childrenProfiles).set({ selectedAvatar: input.selectedAvatar }).where(eq(schema.childrenProfiles.userId, decoded.userId));
      }

      return { success: true };
    }),
});
