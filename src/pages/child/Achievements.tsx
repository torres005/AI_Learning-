import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Star, Award, Flame, Trophy, Zap, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons: Record<string, typeof Award> = {
  learning: Award,
  streak: Flame,
  achievement: Trophy,
  challenge: Zap,
  social: Star,
};

export default function ChildAchievements() {
  const { data, isLoading } = trpc.child.getAchievements.useQuery();

  return (
    <DashboardLayout role="child">
      <div className="space-y-6">
        {/* Stats Header */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StatCard icon={Star} value={data?.totalXp || 0} label="Total XP" color="#F59E0B" />
          <StatCard icon={Award} value={data?.badges.filter((b: any) => b.earned).length || 0} label="Badges Earned" color="#8B5CF6" />
          <StatCard icon={Trophy} value={data?.level || 1} label="Current Level" color="#3B82F6" />
          <StatCard
            icon={Zap}
            value={data ? data.nextLevelXp - data.totalXp : 0}
            label="XP to Next Level"
            color="#10B981"
          />
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#1E293B]">Level {data?.level || 1}</span>
            <span className="text-sm text-[#64748B]">{data?.totalXp || 0} / {data?.nextLevelXp || 500} XP</span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#10B981] h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: data ? `${Math.min(100, (data.totalXp / data.nextLevelXp) * 100)}%` : "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Badge Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data?.badges.map((badge: any, i: number) => {
              const Icon = categoryIcons[badge.category] || Award;
              return (
                <motion.div
                  key={badge.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center text-center ${
                    badge.earned ? "" : "opacity-50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: badge.earned ? 1 : 0.5, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={badge.earned ? { y: -4, boxShadow: `0 8px 24px ${badge.color}30` } : {}}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: badge.earned ? badge.color + "20" : "#F1F5F9" }}
                  >
                    {badge.earned ? (
                      <Icon className="w-8 h-8" style={{ color: badge.color }} />
                    ) : (
                      <Lock className="w-6 h-6 text-[#94A3B8]" />
                    )}
                  </div>
                  <h4 className="font-bold text-[#1E293B] text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-[#94A3B8] line-clamp-2">{badge.earned ? badge.description : "???"}</p>
                  {badge.xpThreshold && (
                    <span className="mt-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: badge.color + "15", color: badge.color }}>
                      {badge.xpThreshold} XP
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Star; value: number; label: string; color: string }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center text-center"
      whileHover={{ y: -2 }}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: color + "15" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-extrabold text-[#1E293B]" style={{ fontFamily: "Nunito, sans-serif" }}>{value}</p>
      <p className="text-xs text-[#64748B] font-medium">{label}</p>
    </motion.div>
  );
}
