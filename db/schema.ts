import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  json,
  date,
  index,
} from "drizzle-orm/mysql-core";

// Users table - supports OAuth (unionId) and local auth (username/password)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  username: varchar("username", { length: 100 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  email: varchar("email", { length: 320 }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 500 }),
  role: mysqlEnum("role", ["child", "parent", "teacher", "admin"]).default("child").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Child profiles
export const childrenProfiles = mysqlTable("children_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  ageGroup: mysqlEnum("ageGroup", ["5-8", "8-12", "12-16"]).notNull(),
  birthDate: date("birthDate"),
  totalXp: int("totalXp").default(0).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  level: int("level").default(1).notNull(),
  selectedAvatar: varchar("selectedAvatar", { length: 255 }).default("/child-avatar-1.png"),
}, (table) => [
  index("idx_child_userId").on(table.userId),
]);

export type ChildrenProfile = typeof childrenProfiles.$inferSelect;

// Parent profiles
export const parentProfiles = mysqlTable("parent_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
});

export type ParentProfile = typeof parentProfiles.$inferSelect;

// Teacher profiles
export const teacherProfiles = mysqlTable("teacher_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  subject: varchar("subject", { length: 255 }),
  grade: varchar("grade", { length: 100 }),
});

export type TeacherProfile = typeof teacherProfiles.$inferSelect;

// Parent-child links
export const parentChildLinks = mysqlTable("parent_child_links", {
  id: serial("id").primaryKey(),
  parentId: bigint("parentId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  status: mysqlEnum("status", ["pending", "accepted"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_link_parent").on(table.parentId),
  index("idx_link_child").on(table.childId),
]);

// Classrooms
export const classrooms = mysqlTable("classrooms", {
  id: serial("id").primaryKey(),
  teacherId: bigint("teacherId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  joinCode: varchar("joinCode", { length: 20 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_classroom_teacher").on(table.teacherId),
]);

// Classroom students
export const classroomStudents = mysqlTable("classroom_students", {
  id: serial("id").primaryKey(),
  classroomId: bigint("classroomId", { mode: "number", unsigned: true }).notNull().references(() => classrooms.id),
  studentId: bigint("studentId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => [
  index("idx_cs_classroom").on(table.classroomId),
  index("idx_cs_student").on(table.studentId),
]);

// Courses
export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  ageGroup: mysqlEnum("ageGroup", ["5-8", "8-12", "12-16"]).notNull(),
  category: mysqlEnum("category", ["ai_basics", "coding", "robotics", "machine_learning", "ethics", "science", "math"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }).notNull(),
  duration: int("duration").notNull(),
  xpReward: int("xpReward").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Course = typeof courses.$inferSelect;

// Lessons
export const lessons = mysqlTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).notNull().references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: mysqlEnum("type", ["video", "interactive", "quiz", "project"]).notNull(),
  content: json("content").notNull(),
  duration: int("duration").notNull(),
  order: int("order").notNull(),
  xpReward: int("xpReward").notNull(),
}, (table) => [
  index("idx_lesson_course").on(table.courseId),
]);

export type Lesson = typeof lessons.$inferSelect;

// Course progress
export const courseProgress = mysqlTable("course_progress", {
  id: serial("id").primaryKey(),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).notNull().references(() => courses.id),
  completedLessons: int("completedLessons").default(0).notNull(),
  totalLessons: int("totalLessons").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
}, (table) => [
  index("idx_cp_child").on(table.childId),
  index("idx_cp_course").on(table.courseId),
]);

// Lesson progress
export const lessonProgress = mysqlTable("lesson_progress", {
  id: serial("id").primaryKey(),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  lessonId: bigint("lessonId", { mode: "number", unsigned: true }).notNull().references(() => lessons.id),
  status: mysqlEnum("status", ["locked", "unlocked", "completed"]).default("locked").notNull(),
  completedAt: timestamp("completedAt"),
  score: int("score"),
}, (table) => [
  index("idx_lp_child").on(table.childId),
  index("idx_lp_lesson").on(table.lessonId),
]);

// Badges
export const badges = mysqlTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["learning", "streak", "achievement", "challenge", "social"]).notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  xpThreshold: int("xpThreshold"),
  requirement: json("requirement"),
});

export type Badge = typeof badges.$inferSelect;

// Child badges
export const childBadges = mysqlTable("child_badges", {
  id: serial("id").primaryKey(),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  badgeId: bigint("badgeId", { mode: "number", unsigned: true }).notNull().references(() => badges.id),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
}, (table) => [
  index("idx_cb_child").on(table.childId),
]);

// Tasks (parent-assigned)
export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  parentId: bigint("parentId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull(),
  dueDate: timestamp("dueDate").notNull(),
  xpReward: int("xpReward").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "confirmed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_task_parent").on(table.parentId),
  index("idx_task_child").on(table.childId),
]);

export type Task = typeof tasks.$inferSelect;

// Homework (teacher-assigned)
export const homework = mysqlTable("homework", {
  id: serial("id").primaryKey(),
  teacherId: bigint("teacherId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  classroomId: bigint("classroomId", { mode: "number", unsigned: true }).notNull().references(() => classrooms.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  dueDate: timestamp("dueDate").notNull(),
  xpReward: int("xpReward").notNull(),
  attachments: json("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_hw_teacher").on(table.teacherId),
  index("idx_hw_classroom").on(table.classroomId),
]);

// Homework submissions
export const homeworkSubmissions = mysqlTable("homework_submissions", {
  id: serial("id").primaryKey(),
  homeworkId: bigint("homeworkId", { mode: "number", unsigned: true }).notNull().references(() => homework.id),
  studentId: bigint("studentId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: json("attachments"),
  grade: varchar("grade", { length: 10 }),
  feedback: text("feedback"),
  status: mysqlEnum("status", ["submitted", "graded"]).default("submitted").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  gradedAt: timestamp("gradedAt"),
}, (table) => [
  index("idx_hs_homework").on(table.homeworkId),
  index("idx_hs_student").on(table.studentId),
]);

// Streak logs
export const streakLogs = mysqlTable("streak_logs", {
  id: serial("id").primaryKey(),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  date: date("date").notNull(),
  activityType: varchar("activityType", { length: 100 }).notNull(),
  xpEarned: int("xpEarned").notNull(),
}, (table) => [
  index("idx_sl_child").on(table.childId),
  index("idx_sl_date").on(table.date),
]);

// AI Tutor conversations
export const aiTutorConversations = mysqlTable("ai_tutor_conversations", {
  id: serial("id").primaryKey(),
  childId: bigint("childId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_ai_child").on(table.childId),
]);

// Notifications
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["achievement", "task", "homework", "streak", "general"]).notNull(),
  read: mysqlEnum("read", ["0", "1"]).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_notif_user").on(table.userId),
]);
