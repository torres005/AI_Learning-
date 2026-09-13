import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Flame, Star, Award, BookOpen, Clock, FileText, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentReports() {
  const { data: dashboardData } = trpc.parent.getDashboard.useQuery();
  const [childId, setChildId] = useState<number>(0);
  
  const { data: reportData, isLoading } = trpc.parent.getReports.useQuery(
    { childId: childId || 0 },
    { enabled: childId > 0 }
  );

  return (
    <DashboardLayout role="parent">
      <div className="space-y-6">
        {/* Child Selector */}
        {dashboardData?.children && dashboardData.children.length > 0 && (
          <div className="flex gap-3 flex-wrap">
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
          </div>
        )}

        {childId > 0 && (
          <>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            ) : reportData ? (
              <>
                {/* Summary Card */}
                <motion.div
                  className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl p-6 text-white shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
                    <FileText className="w-5 h-5" />
                    Learning Report
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <SummaryStat icon={Clock} value={`${reportData.summary.totalTime}m`} label="Total Time" />
                    <SummaryStat icon={BookOpen} value={reportData.summary.lessonsCompleted} label="Lessons Done" />
                    <SummaryStat icon={Star} value={reportData.summary.xpEarned} label="XP Earned" />
                    <SummaryStat icon={Award} value={reportData.summary.badgesEarned} label="Badges" />
                    <SummaryStat icon={Flame} value={reportData.summary.streak} label="Streak" />
                  </div>
                </motion.div>

                {/* Insights */}
                <motion.div
                  className="bg-white rounded-2xl p-5 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-bold text-[#1E293B] mb-3 flex items-center gap-2" style={{ fontFamily: "Nunito, sans-serif" }}>
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    AI Insights
                  </h3>
                  <div className="bg-[#F0F9FF] rounded-xl p-4">
                    <p className="text-sm text-[#1E293B] leading-relaxed">
                      {reportData.summary.xpEarned > 200
                        ? `Amazing progress! Your child has earned ${reportData.summary.xpEarned} XP and is currently at Level ${reportData.summary.level}. They're showing great dedication to learning AI concepts. Keep encouraging them!`
                        : `Your child is getting started on their AI learning journey. They've earned ${reportData.summary.xpEarned} XP so far. Encourage them to complete more lessons to build a strong foundation!`}
                    </p>
                  </div>
                </motion.div>

                {/* Course Breakdown */}
                {reportData.courseProgress.length > 0 && (
                  <motion.div
                    className="bg-white rounded-2xl p-5 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-bold text-[#1E293B] mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>
                      Course Breakdown
                    </h3>
                    <div className="space-y-3">
                      {reportData.courseProgress.map((cp: any) => (
                        <div key={cp.id} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              cp.status === "completed" ? "bg-[#10B981]" : "bg-[#8B5CF6]"
                            }`} />
                            <span className="text-sm text-[#1E293B]">Course #{cp.courseId}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-[#64748B]">{cp.completedLessons}/{cp.totalLessons} lessons</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              cp.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                            }`}>
                              {cp.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            ) : null}
          </>
        )}

        {!childId && dashboardData?.children && dashboardData.children.length > 0 && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B]">Select a child to view their learning report</p>
          </div>
        )}

        {(!dashboardData?.children || dashboardData.children.length === 0) && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B] mb-3">Link to your child's account to view reports</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function SummaryStat({ icon: Icon, value, label }: { icon: typeof Clock; value: string | number; label: string }) {
  return (
    <div className="text-center">
      <Icon className="w-5 h-5 mx-auto mb-1 text-white/70" />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}
