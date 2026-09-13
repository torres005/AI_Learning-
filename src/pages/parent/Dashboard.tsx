import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, Users, FileText, Plus, Flame, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentDashboard() {
  const { data, isLoading } = trpc.parent.getDashboard.useQuery();
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  
  const { data: progressData } = trpc.parent.getChildProgress.useQuery(
    { childId: selectedChild || 0 },
    { enabled: !!selectedChild }
  );

  return (
    <DashboardLayout role="parent">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <motion.div
            className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
            <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Parent Hub
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              {data?.children && data.children.length > 0
                ? "Monitor your children's learning pathways, set custom tasks, and review weekly analytics."
                : "Get started by linking your parent account with your child's student profile."}
            </p>
          </motion.div>

          {/* Children Roster Slider */}
          {data?.children && data.children.length > 0 ? (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Linked Children</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {data.children.map((child) => {
                  const selected = selectedChild === child.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child.id === selectedChild ? null : child.id)}
                      className={`flex-shrink-0 flex items-center gap-3.5 p-4.5 rounded-3xl transition-all border ${
                        selected
                          ? "border-purple-600 bg-purple-50/50 shadow-md"
                          : "border-slate-200/40 bg-white hover:border-slate-350 hover:shadow-sm"
                      }`}
                    >
                      <img src={child.avatar} alt={child.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                      <div className="text-left">
                        <p className="font-bold text-slate-800 text-sm">{child.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-450">
                          <span className="flex items-center gap-0.5"><Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{child.streak} Day</span>
                          <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />{child.xp} XP</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-250/50 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Users className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-bounce" />
              <p className="text-slate-500 text-sm font-semibold mb-4">No student accounts linked to your profile yet.</p>
              <Link to="/parent/progress">
                <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow-md shadow-purple-600/25 transition-all text-xs uppercase tracking-wider">
                  Link Child Profile
                </button>
              </Link>
            </motion.div>
          )}

          {/* Selected Child Progress */}
          {selectedChild && progressData && (
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-black text-slate-800 text-sm mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
                Course Progression Details
              </h3>
              <div className="space-y-4">
                {progressData.progress.map((p) => (
                  <div key={p.course.id} className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{p.course.title}</span>
                      <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                {progressData.progress.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    No active courses started yet
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Quick Actions Panel */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Management Actions</h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QuickActionCard to="/parent/tasks" icon={Plus} label="Assign Quest Task" color="#8B5CF6" />
              <QuickActionCard to="/parent/progress" icon={TrendingUp} label="View Analytics" color="#3B82F6" />
              <QuickActionCard to="/parent/reports" icon={FileText} label="Weekly Reports" color="#10B981" />
              <QuickActionCard to="/parent/progress" icon={Users} label="Link Child Account" color="#F59E0B" />
            </motion.div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function QuickActionCard({ to, icon: Icon, label, color }: { to: string; icon: typeof Plus; label: string; color: string }) {
  return (
    <Link to={to}>
      <motion.div
        className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-all group"
        whileHover={{ y: -3 }}
      >
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: color + "12" }}>
          <Icon className="w-5 h-5 animate-pulse" style={{ color }} />
        </div>
        <span className="text-xs font-black text-slate-700 group-hover:text-purple-600 transition-colors">{label}</span>
      </motion.div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-3xl" />
      <div className="flex gap-4">
        {[1, 2].map(i => <Skeleton key={i} className="h-20 w-48 rounded-3xl flex-shrink-0" />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
      </div>
    </div>
  );
}

