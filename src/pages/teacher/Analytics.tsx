import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, Star, Flame, Users, Award, Target, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#F43F5E", "#06B6D4"];

export default function TeacherAnalytics() {
  const { data, isLoading } = trpc.teacher.getDashboard.useQuery();

  // Prepare chart data
  const ageGroupData = [
    { name: "Ages 5-8", count: data?.students.filter((s) => s.ageGroup === "5-8").length || 0 },
    { name: "Ages 8-12", count: data?.students.filter((s) => s.ageGroup === "8-12").length || 0 },
    { name: "Ages 12-16", count: data?.students.filter((s) => s.ageGroup === "12-16").length || 0 },
  ];

  const students = data?.students || [];
  const xpRanges = [
    { name: "0-100 XP", count: students.filter((s) => s.xp <= 100).length },
    { name: "100-500", count: students.filter((s) => s.xp > 100 && s.xp <= 500).length },
    { name: "500-1000", count: students.filter((s) => s.xp > 500 && s.xp <= 1000).length },
    { name: "1000+", count: students.filter((s) => s.xp > 1000).length },
  ];

  const topStudents = [...(data?.students || [])].sort((a, b) => b.xp - a.xp).slice(0, 5);

  return (
    <DashboardLayout role="teacher">
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StatCard icon={Users} value={data?.stats.totalStudents || 0} label="Total Students" color="#3B82F6" />
            <StatCard icon={Star} value={students.reduce((sum, s) => sum + s.xp, 0)} label="Total XP" color="#F59E0B" />
            <StatCard icon={Flame} value={Math.round(students.reduce((sum, s) => sum + s.streak, 0) / (students.length || 1))} label="Avg Streak" color="#F43F5E" />
            <StatCard icon={Award} value={Math.round(students.reduce((sum, s) => sum + s.level, 0) / (students.length || 1))} label="Avg Level" color="#8B5CF6" />
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
                <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                Age Group Distribution
              </h3>
              {data?.students.length === 0 ? (
                <p className="text-sm text-[#94A3B8] text-center py-8">No student data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* XP Distribution */}
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
                <Target className="w-5 h-5 text-[#10B981]" />
                XP Distribution
              </h3>
              {data?.students.length === 0 ? (
                <p className="text-sm text-[#94A3B8] text-center py-8">No student data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={xpRanges} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={4}>
                      {xpRanges.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* Top Students */}
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
              <Zap className="w-5 h-5 text-[#F59E0B]" />
              Top Performers
            </h3>
            {topStudents.length === 0 ? (
              <p className="text-sm text-[#94A3B8] text-center py-4">No students yet</p>
            ) : (
              <div className="space-y-3">
                {topStudents.map((student, i) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-xl">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-[#F59E0B] text-white" : i === 1 ? "bg-[#94A3B8] text-white" : i === 2 ? "bg-[#CD7F32] text-white" : "bg-[#F1F5F9] text-[#64748B]"
                    }`}>
                      {i + 1}
                    </div>
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#1E293B]">{student.name}</p>
                      <p className="text-xs text-[#64748B]">Level {student.level} | Streak {student.streak} days</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F59E0B]" />
                      <span className="font-bold text-sm text-[#1E293B]">{student.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Users; value: number; label: string; color: string }) {
  return (
    <motion.div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center text-center" whileHover={{ y: -2 }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: color + "15" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-extrabold text-[#1E293B]" style={{ fontFamily: "Nunito, sans-serif" }}>{value}</p>
      <p className="text-xs text-[#64748B] font-medium">{label}</p>
    </motion.div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
