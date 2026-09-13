import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Flame, Star, Award, BookOpen, Link as LinkIcon, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentProgress() {
  const { data: dashboardData } = trpc.parent.getDashboard.useQuery();
  const [childId, setChildId] = useState<number>(0);
  const [childUsername, setChildUsername] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");
  
  const { data: progressData, isLoading } = trpc.parent.getChildProgress.useQuery(
    { childId: childId || 0 },
    { enabled: childId > 0 }
  );

  const linkMutation = trpc.parent.linkChild.useMutation({
    onSuccess: () => {
      setLinkSuccess("Link request sent! Your child needs to accept it.");
      setChildUsername("");
      setLinkError("");
    },
    onError: (err) => {
      setLinkError(err.message);
      setLinkSuccess("");
    },
  });

  const handleLink = () => {
    if (!childUsername.trim()) return;
    setLinkError("");
    setLinkSuccess("");
    linkMutation.mutate({ childUsername: childUsername.trim() });
  };

  return (
    <DashboardLayout role="parent">
      <div className="space-y-6">
        {/* Link Child Section */}
        {(!dashboardData?.children || dashboardData.children.length === 0) && (
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-[#1E293B] mb-3 flex items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
              <LinkIcon className="w-5 h-5 text-[#8B5CF6]" />
              Link to Your Child
            </h3>
            <p className="text-sm text-[#64748B] mb-3">Enter your child's username to connect and monitor their progress</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={childUsername}
                onChange={(e) => setChildUsername(e.target.value)}
                placeholder="Child's username"
                className="flex-1 px-4 py-2.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#8B5CF6] outline-none text-sm"
              />
              <button
                onClick={handleLink}
                disabled={linkMutation.isPending}
                className="px-5 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors text-sm disabled:opacity-50"
              >
                {linkMutation.isPending ? "Linking..." : "Link"}
              </button>
            </div>
            {linkError && <p className="text-sm text-red-500 mt-2">{linkError}</p>}
            {linkSuccess && <p className="text-sm text-[#10B981] mt-2">{linkSuccess}</p>}
          </motion.div>
        )}

        {/* Child Selector */}
        {dashboardData?.children && dashboardData.children.length > 0 && (
          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {dashboardData.children.map((child) => (
              <button
                key={child.id}
                onClick={() => setChildId(child.id === childId ? 0 : child.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  childId === child.id
                    ? "bg-[#8B5CF6] text-white shadow-md"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#8B5CF6]"
                }`}
              >
                <img src={child.avatar} alt={child.name} className="w-6 h-6 rounded-full object-cover" />
                {child.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Progress Detail */}
        {childId > 0 && (
          <>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            ) : progressData ? (
              <>
                {/* Stats */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <StatCard icon={Star} value={progressData.stats?.totalXp || 0} label="Total XP" color="#F59E0B" />
                  <StatCard icon={Flame} value={progressData.stats?.currentStreak || 0} label="Day Streak" color="#F43F5E" />
                  <StatCard icon={Award} value={progressData.stats?.level || 1} label="Level" color="#8B5CF6" />
                  <StatCard icon={BookOpen} value={progressData.progress.length} label="Courses Started" color="#3B82F6" />
                </motion.div>

                {/* Course Progress */}
                <motion.div
                  className="bg-white rounded-2xl p-5 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-bold text-[#1E293B] mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>
                    Course Progress
                  </h3>
                  <div className="space-y-4">
                    {progressData.progress.map((p) => (
                      <div key={p.course.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img src={p.course.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-sm font-medium text-[#1E293B]">{p.course.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              p.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                            }`}>
                              {p.status}
                            </span>
                            <span className="text-xs font-bold text-[#8B5CF6]">{p.progress}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full transition-all"
                            style={{
                              width: `${p.progress}%`,
                              backgroundColor: p.status === "completed" ? "#10B981" : "#8B5CF6",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {progressData.progress.length === 0 && (
                      <p className="text-sm text-[#94A3B8] text-center py-4">No courses started yet</p>
                    )}
                  </div>
                </motion.div>
              </>
            ) : null}
          </>
        )}

        {!childId && dashboardData?.children && dashboardData.children.length > 0 && (
          <motion.div
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TrendingUp className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B]">Select a child above to view their progress</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Star; value: number; label: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: color + "15" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-extrabold text-[#1E293B]" style={{ fontFamily: "Nunito, sans-serif" }}>{value}</p>
      <p className="text-xs text-[#64748B] font-medium">{label}</p>
    </div>
  );
}
