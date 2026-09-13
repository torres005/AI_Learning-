import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, Trophy, Bot, TrendingUp,
  ClipboardList, FileText, Users, BookMarked, BarChart3,
  Settings, LogOut, Sparkles, Bell, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const childNav = [
  { path: "/child", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/child/courses", icon: BookOpen, label: "AI Courses" },
  { path: "/child/achievements", icon: Trophy, label: "Achievements" },
  { path: "/child/ai-tutor", icon: Bot, label: "AI Tutor" },
];

const parentNav = [
  { path: "/parent", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/parent/progress", icon: TrendingUp, label: "Progress" },
  { path: "/parent/tasks", icon: ClipboardList, label: "Tasks" },
  { path: "/parent/reports", icon: FileText, label: "Reports" },
];

const teacherNav = [
  { path: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/teacher/students", icon: Users, label: "Students" },
  { path: "/teacher/homework", icon: BookMarked, label: "Homework" },
  { path: "/teacher/analytics", icon: BarChart3, label: "Analytics" },
];

export default function DashboardLayout({ children, role }: { children: React.ReactNode; role: "child" | "parent" | "teacher" }) {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const nav = role === "child" ? childNav : role === "parent" ? parentNav : teacherNav;
  const accentColor = role === "child" ? "#3B82F6" : role === "parent" ? "#8B5CF6" : "#10B981";
  const hoverBg = role === "child" ? "hover:bg-blue-50/50 hover:text-blue-600" : role === "parent" ? "hover:bg-purple-50/50 hover:text-purple-600" : "hover:bg-emerald-50/50 hover:text-[#10B981]";

  const getAvatar = () => {
    if (role === "child" && profile?.selectedAvatar) return profile.selectedAvatar;
    if (user?.avatar) return user.avatar;
    if (role === "child") return "/child-avatar-1.png";
    if (role === "parent") return "/parent-avatar.png";
    return "/teacher-avatar.png";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden font-body text-slate-700">
      
      {/* Background ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-100/40 blur-[80px]" style={{ top: "10%", right: "20%" }} />
        <div className="absolute w-[250px] h-[250px] rounded-full bg-purple-100/30 blur-[70px]" style={{ bottom: "10%", left: "10%" }} />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-2.5 border-b border-slate-100">
          <div
            className={`${role === "child" ? "w-7.5 h-7.5 rounded-lg" : "w-9 h-9 rounded-xl"} flex items-center justify-center shadow-md text-white`}
            style={{ backgroundColor: accentColor }}
          >
            <Sparkles className={role === "child" ? "w-3.5 h-3.5" : "w-4.5 h-4.5"} />
          </div>
          <span
            className={`${role === "child" ? "text-base" : "text-lg"} font-black text-slate-800 tracking-tight`}
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Smart Learning
          </span>
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <img src={getAvatar()} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-xs truncate">{user?.fullName || "Explorer"}</p>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full text-white font-black tracking-wider uppercase inline-block mt-0.5"
                style={{ backgroundColor: accentColor }}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/child" && item.path !== "/parent" && item.path !== "/teacher" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "text-white shadow-md shadow-slate-200/50"
                    : `text-slate-500 ${hoverBg}`
                }`}
                style={isActive ? { backgroundColor: accentColor } : {}}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom panel */}
        <div className="p-4 space-y-1 border-t border-slate-100 bg-slate-50/50">
          <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 w-full transition-all">
            <Settings className="w-4.5 h-4.5" />
            Settings
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200/30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-white border border-slate-200/30 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              {nav.find((n) => location.pathname === n.path || (n.path !== "/child" && n.path !== "/parent" && n.path !== "/teacher" && location.pathname.startsWith(n.path)))?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 text-slate-500 bg-white border border-slate-200/50 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200/50 shadow-xl z-50 p-4"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                      <h4 className="font-bold text-slate-800 text-sm mb-3">Notifications</h4>
                      <div className="space-y-2.5">
                        <NotificationItem
                          title="Welcome Aboard!"
                          time="Just now"
                          desc="You successfully signed in to Smart Learning Adventure."
                        />
                        <NotificationItem
                          title="New Lesson Available"
                          time="2h ago"
                          desc="Explore the new AI Basics course chapter!"
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content viewport */}
        <main className="flex-1 px-6 pb-8 pt-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationItem({ title, time, desc }: { title: string; time: string; desc: string }) {
  return (
    <div className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-slate-800">{title}</span>
        <span className="text-[9px] text-slate-400">{time}</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-normal">{desc}</p>
    </div>
  );
}

