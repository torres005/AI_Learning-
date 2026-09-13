import { Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChildDashboard from "./pages/child/Dashboard";
import ChildCourses from "./pages/child/Courses";
import ChildCourseDetail from "./pages/child/CourseDetail";
import ChildAchievements from "./pages/child/Achievements";
import ChildAITutor from "./pages/child/AITutor";
import ParentDashboard from "./pages/parent/Dashboard";
import ParentProgress from "./pages/parent/Progress";
import ParentTasks from "./pages/parent/Tasks";
import ParentReports from "./pages/parent/Reports";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudents from "./pages/teacher/Students";
import TeacherHomework from "./pages/teacher/Homework";
import TeacherAnalytics from "./pages/teacher/Analytics";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/child" element={<ChildDashboard />} />
      <Route path="/child/courses" element={<ChildCourses />} />
      <Route path="/child/course/:id" element={<ChildCourseDetail />} />
      <Route path="/child/achievements" element={<ChildAchievements />} />
      <Route path="/child/ai-tutor" element={<ChildAITutor />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/parent/progress" element={<ParentProgress />} />
      <Route path="/parent/tasks" element={<ParentTasks />} />
      <Route path="/parent/reports" element={<ParentReports />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/students" element={<TeacherStudents />} />
      <Route path="/teacher/homework" element={<TeacherHomework />} />
      <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
