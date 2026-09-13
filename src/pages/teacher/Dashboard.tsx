import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Users, BookOpen, Plus, X, GraduationCap, Flame, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherDashboard() {
  const { data, isLoading, refetch } = trpc.teacher.getDashboard.useQuery();
  const createClassMutation = trpc.teacher.createClassroom.useMutation({ onSuccess: () => { refetch(); setShowForm(false); } });

  const [showForm, setShowForm] = useState(false);
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !subject) return;
    createClassMutation.mutate({ name: className, subject });
  };

  return (
    <DashboardLayout role="teacher">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StatCard icon={Users} value={data?.stats.totalStudents || 0} label="Active Students" color="#10B981" />
            <StatCard icon={BookOpen} value={data?.classrooms.length || 0} label="Total Classrooms" color="#3B82F6" />
            <StatCard icon={GraduationCap} value={data?.classrooms.reduce((sum, c) => sum + c.studentCount, 0) || 0} label="Class Enrollment" color="#8B5CF6" />
            <StatCard icon={Star} value={data?.students.reduce((sum, s) => sum + s.xp, 0) || 0} label="Aggregated XP" color="#F59E0B" />
          </motion.div>

          {/* Action Header */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>Your Classrooms</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-md shadow-emerald-600/20 transition-all text-xs uppercase tracking-wider"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "Add Classroom"}
            </button>
          </div>

          {/* Create classroom Form */}
          {showForm && (
            <motion.form
              onSubmit={handleCreateClass}
              className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-bold text-slate-800 text-sm">Create a New Classroom</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classroom Name</label>
                  <input type="text" required value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g., Computer Science Section A" className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Focus</label>
                  <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Artificial Intelligence & Logic" className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none" />
                </div>
              </div>
              <button type="submit" disabled={createClassMutation.isPending} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all disabled:opacity-50 text-xs uppercase tracking-wider">
                {createClassMutation.isPending ? "Creating..." : "Save Classroom"}
              </button>
            </motion.form>
          )}

          {/* Classrooms Cards Grid */}
          {data?.classrooms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-400 font-bold text-sm">No classrooms registered. Create one to invite students!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data?.classrooms.map((cls, i) => (
                <motion.div
                  key={cls.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/40 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <GraduationCap className="w-5.5 h-5.5 text-emerald-600" />
                    </div>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-black font-mono shadow-sm">
                      CODE: {cls.joinCode}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{cls.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{cls.subject}</p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-450 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" />{cls.studentCount} active students</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Students Table */}
          {data?.students && data.students.length > 0 && (
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-black text-slate-800 text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Class Roster</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black text-left">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Age Group</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">XP Points</th>
                      <th className="py-3 px-4">Active Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors font-semibold text-slate-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                            <span className="font-bold text-slate-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500">Ages {student.ageGroup}</td>
                        <td className="py-3 px-4"><span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold">Lv.{student.level}</span></td>
                        <td className="py-3 px-4"><span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />{student.xp}</span></td>
                        <td className="py-3 px-4"><span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{student.streak} Days</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Users; value: number; label: string; color: string }) {
  return (
    <motion.div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center group" whileHover={{ y: -3 }}>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform" style={{ backgroundColor: color + "12" }}>
        <Icon className="w-5.5 h-5.5" style={{ color }} />
      </div>
      <p className="text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</p>
      <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider mt-1">{label}</p>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
      </div>
      <Skeleton className="h-44 rounded-3xl" />
    </div>
  );
}
