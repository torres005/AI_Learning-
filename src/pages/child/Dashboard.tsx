import { Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Flame, Star, Award, BookOpen, Trophy, ChevronRight, Target, Sparkles, MessageSquare, Bot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const childAvatars = [
  "/child-avatar-1.png",
  "/child-avatar-2.png",
  "/child-avatar-3.png"
];

export default function ChildDashboard() {
  const { user, refresh } = useAuth();
  const { data, isLoading, refetch } = trpc.child.getDashboard.useQuery();
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      refetch();
      refresh();
    }
  });

  const [avatarOpen, setAvatarOpen] = useState(false);

  const handleAvatarSelect = (avatarPath: string) => {
    updateProfileMutation.mutate({ selectedAvatar: avatarPath });
    setAvatarOpen(false);
  };

  return (
    <DashboardLayout role="child">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 p-8 text-white shadow-xl shadow-blue-500/10 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Ambient decorative circle */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute right-1/3 -bottom-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                  Level {Math.floor((data?.stats.totalXp || 0) / 100) + 1} Learner
                </div>
                <h2 className="text-3xl font-black mb-1.5 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Good {getGreeting()}, {user?.fullName || "Explorer"}!
                </h2>
                <p className="text-white/80 text-sm">You are doing fantastic! Ready for today's AI quests?</p>
              </div>
              
              {/* Interactive Avatar Dialog */}
              <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
                <DialogTrigger asChild>
                  <motion.div className="relative group cursor-pointer shrink-0">
                    <motion.div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 blur opacity-65 group-hover:opacity-100 transition-opacity" />
                    <motion.img
                      src={data?.profile?.selectedAvatar || "/child-avatar-1.png"}
                      alt="avatar"
                      className="relative w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <span className="text-[8px] font-black text-white uppercase tracking-wider text-center">Change</span>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-xs bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100">
                  <DialogHeader>
                    <DialogTitle className="text-center font-black text-slate-800 text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
                      Choose your character!
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-3 py-4">
                    {childAvatars.map((av, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAvatarSelect(av)}
                        className={`p-1 rounded-2xl border-3 transition-all ${
                          (data?.profile?.selectedAvatar || "/child-avatar-1.png") === av
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-transparent hover:border-slate-200"
                        }`}
                      >
                        <img src={av} alt={`Avatar option ${index + 1}`} className="w-16 h-16 rounded-xl object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <StatCard icon={Flame} value={data?.stats.streak || 0} label="Day Streak" color="#F59E0B" />
              <StatCard icon={Star} value={data?.stats.totalXp || 0} label="Total XP" color="#3B82F6" />
              <StatCard icon={Award} value={data?.stats.badgesEarned || 0} label="Badges Earned" color="#8B5CF6" />
              <StatCard icon={BookOpen} value={data?.stats.coursesCompleted || 0} label="Finished Tasks" color="#10B981" />
            </div>
          </motion.div>

          {/* Continue Learning */}
          {data?.inProgressCourses && data.inProgressCourses.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Continue Your Adventure
                </h3>
                <Link to="/child/courses" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 group">
                  See All Quests <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.inProgressCourses.map((course, i) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                    <Link to={`/child/course/${course.id}`}>
                      <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200/40 transition-all overflow-hidden group flex flex-col h-full">
                        <div className="h-28 overflow-hidden relative">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1">
                            <span>{course.progress}% complete</span>
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Daily Challenge & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Daily Challenge */}
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/50 hover:shadow-md transition-shadow relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full blur-md" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-black text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Daily Challenge</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Complete 1 AI lesson today to unlock a rare reward badge and bonus experience points!</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">+50 XP</span>
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">+1 Star</span>
              </div>
              <Link to="/child/courses">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/10 transition-all flex items-center gap-1">
                  Start Quest <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            {/* AI Tutor Quick Access */}
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-sm border border-blue-200/50 hover:shadow-md transition-shadow relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-md" />
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Ask AI Tutor</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Stuck on a tricky concept or homework puzzle? Ask your interactive study companion, active 24/7!</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">Fast Answers</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">Online Helper</span>
              </div>
              <Link to="/child/ai-tutor">
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat Now
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Recent Achievements & Streak Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Recent Badges */}
            <motion.div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                  <Trophy className="w-5 h-5 text-purple-500" />
                  Recent Badges
                </h3>
                <Link to="/child/achievements" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hover:text-blue-600">View All</Link>
              </div>
              {data?.recentAchievements && data.recentAchievements.length > 0 ? (
                <div className="flex gap-3 flex-wrap">
                  {data.recentAchievements.map((badge) => (
                    <motion.div
                      key={badge.id}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group cursor-pointer border border-slate-100"
                      style={{ backgroundColor: badge.color + "12" }}
                      title={badge.name}
                      whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                    >
                      <Award className="w-7 h-7" style={{ color: badge.color }} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-normal py-4">Complete coding lessons and math challenges to earn your first reward badges!</p>
              )}
            </motion.div>

            {/* Streak Calendar */}
            <motion.div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>{data?.stats.streak || 0}-Day Streak!</h3>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {data?.streakCalendar.slice(-28).map((day, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${
                      day.isToday
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                    style={{
                      backgroundColor: day.completed ? "#3B82F6" : "#F1F5F9",
                      color: day.completed ? "white" : "#94A3B8",
                    }}
                    title={day.date}
                  >
                    {day.completed ? <Flame className="w-3.5 h-3.5 fill-white text-white" /> : i + 1}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Flame; value: number; label: string; color: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3 border border-white/5 shadow-inner">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: color + "20" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-black leading-tight tracking-tight">{value}</p>
        <p className="text-[10px] text-white/70 font-bold uppercase truncate">{label}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-52 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    </div>
  );
}

