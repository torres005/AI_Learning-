import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { userRouter } from "./routers/user";
import { courseRouter } from "./routers/course";
import { lessonRouter } from "./routers/lesson";
import { childRouter } from "./routers/child";
import { parentRouter } from "./routers/parent";
import { taskRouter } from "./routers/task";
import { teacherRouter } from "./routers/teacher";
import { homeworkRouter } from "./routers/homework";
import { aiTutorRouter } from "./routers/aiTutor";
import { leaderboardRouter } from "./routers/leaderboard";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  user: userRouter,
  course: courseRouter,
  lesson: lessonRouter,
  child: childRouter,
  parent: parentRouter,
  task: taskRouter,
  teacher: teacherRouter,
  homework: homeworkRouter,
  aiTutor: aiTutorRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
