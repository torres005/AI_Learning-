import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Clock, BarChart3, ChevronRight, Sparkles, Code, Cpu, Globe, Brain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { key: "all", label: "All Categories", icon: Sparkles },
  { key: "ai_basics", label: "AI Basics", icon: Brain },
  { key: "coding", label: "Coding Quests", icon: Code },
  { key: "robotics", label: "Robotics Hub", icon: Cpu },
  { key: "machine_learning", label: "ML Playgrounds", icon: Brain },
  { key: "ethics", label: "AI Ethics", icon: Globe },
];

const ageGroups = [
  { key: "5-8", label: "Ages 5-8", color: "#3B82F6", hoverGlow: "shadow-glow-blue", description: "Fun introductions to AI through matching games, visual patterns, and playful interactive stories!" },
  { key: "8-12", label: "Ages 8-12", color: "#10B981", hoverGlow: "shadow-glow-green", description: "Hands-on learning with block coding, smart chatbot training, and simple machine learning tasks!" },
  { key: "12-16", label: "Ages 12-16", color: "#8B5CF6", hoverGlow: "shadow-glow-purple", description: "Deep dive into real machine learning algorithms, programming with Python, and ethics research!" },
];

export default function ChildCourses() {
  const { data: profileData } = trpc.user.getProfile.useQuery();
  const childAgeGroup = (profileData?.profile as { ageGroup?: "5-8" | "8-12" | "12-16" })?.ageGroup || "8-12";
  
  const [selectedAge, setSelectedAge] = useState<string>(childAgeGroup);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data, isLoading } = trpc.course.list.useQuery({ ageGroup: selectedAge as "5-8" | "8-12" | "12-16" });

  const filteredCourses = data?.courses.filter((c: any) => {
    if (selectedCategory === "all") return true;
    return c.category === selectedCategory;
  }) || [];

  const currentAgeInfo = ageGroups.find((ag) => ag.key === selectedAge);

  return (
    <DashboardLayout role="child">
      <div className="space-y-6">
        
        {/* Age Group Tabs */}
        <div className="flex gap-2.5 flex-wrap">
          {ageGroups.map((ag) => {
            const active = selectedAge === ag.key;
            return (
              <button
                key={ag.key}
                onClick={() => setSelectedAge(ag.key)}
                className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all border ${
                  active
                    ? "text-white shadow-md " + ag.hoverGlow
                    : "bg-white text-slate-500 hover:bg-slate-50 border-slate-200/50"
                }`}
                style={active ? { backgroundColor: ag.color, borderColor: ag.color } : {}}
              >
                {ag.label}
              </button>
            );
          })}
        </div>

        {/* Age Description Banner */}
        {currentAgeInfo && (
          <motion.div
            key={selectedAge}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute right-0 top-0 w-24 h-24 rounded-full blur-md opacity-20" style={{ backgroundColor: currentAgeInfo.color }} />
            <p className="text-xs text-slate-500 leading-relaxed font-semibold relative z-10">{currentAgeInfo.description}</p>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  active
                    ? "bg-slate-800 text-white border-slate-850 shadow-sm"
                    : "bg-white text-slate-500 hover:bg-slate-50 border-slate-200/50"
                }`}
              >
                <cat.icon className={`w-4 h-4 ${active ? "text-amber-400" : ""}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-3xl" />)}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Sparkles className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-pulse" />
            <p className="text-slate-400 font-bold text-sm">No quests found in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: any, i: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/child/course/${course.id}`}>
                  <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all border border-slate-200/40 overflow-hidden group h-full flex flex-col justify-between">
                    <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm"
                        style={{
                          backgroundColor:
                            course.difficulty === "easy" ? "#10B981" : course.difficulty === "medium" ? "#F59E0B" : "#F43F5E",
                        }}
                      >
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-600 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{course.description}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 p-2.5 rounded-2xl">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" />{course.duration} mins</span>
                          <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-slate-400" />{course.xpReward} XP</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-[9px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-black uppercase tracking-wider">
                            {course.category.replace("_", " ")}
                          </span>
                          <span className="text-blue-600 font-black text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Enter Quest <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

