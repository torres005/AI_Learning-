import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Users, Star, Flame, BookOpen, Search, X, TrendingUp, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherStudents() {
  const { data, isLoading } = trpc.teacher.getDashboard.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const { data: studentDetail } = trpc.teacher.getStudentDetail.useQuery(
    { studentId: selectedStudent || 0 },
    { enabled: !!selectedStudent }
  );

  const filteredStudents = data?.students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none"
          />
        </div>

        {/* Student Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Users className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B]">{searchTerm ? "No students match your search" : "No students enrolled yet"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student, i) => (
              <motion.div
                key={student.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedStudent(student.id === selectedStudent ? null : student.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-[#1E293B]">{student.name}</h3>
                    <p className="text-xs text-[#64748B]">Ages {student.ageGroup}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-[#F0F9FF] rounded-lg">
                    <Star className="w-4 h-4 text-[#F59E0B] mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#1E293B]">{student.xp}</p>
                    <p className="text-[10px] text-[#94A3B8]">XP</p>
                  </div>
                  <div className="text-center p-2 bg-[#F0F9FF] rounded-lg">
                    <Flame className="w-4 h-4 text-[#F43F5E] mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#1E293B]">{student.streak}</p>
                    <p className="text-[10px] text-[#94A3B8]">Streak</p>
                  </div>
                  <div className="text-center p-2 bg-[#F0F9FF] rounded-lg">
                    <Award className="w-4 h-4 text-[#8B5CF6] mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#1E293B]">Lv.{student.level}</p>
                    <p className="text-[10px] text-[#94A3B8]">Level</p>
                  </div>
                </div>
                <button className="w-full py-2 text-sm font-semibold text-[#10B981] bg-[#10B981]/5 rounded-full hover:bg-[#10B981]/10 transition-colors">
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Student Detail Modal */}
        <AnimatePresence>
          {selectedStudent && studentDetail && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={studentDetail.student?.avatar || "/child-avatar-1.png"}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-[#1E293B]">{studentDetail.student?.fullName}</h3>
                      <p className="text-xs text-[#64748B]">Level {studentDetail.profile?.level || 1} | {studentDetail.profile?.totalXp || 0} XP</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-[#F1F5F9] rounded-lg">
                    <X className="w-5 h-5 text-[#64748B]" />
                  </button>
                </div>

                {/* Course Progress */}
                <h4 className="font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#10B981]" />
                  Course Progress
                </h4>
                {studentDetail.courses.length === 0 ? (
                  <p className="text-sm text-[#94A3B8] py-4 text-center">No courses started yet</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {studentDetail.courses.map((c) => (
                      <div key={c.course.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#1E293B]">{c.course.title}</span>
                          <span className="text-xs font-bold text-[#10B981]">{c.progress}%</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                          <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-[#F0F9FF] rounded-xl">
                    <TrendingUp className="w-5 h-5 text-[#3B82F6] mx-auto mb-1" />
                    <p className="text-sm font-bold text-[#1E293B]">{studentDetail.courses.length}</p>
                    <p className="text-[10px] text-[#94A3B8]">Courses</p>
                  </div>
                  <div className="text-center p-3 bg-[#F0F9FF] rounded-xl">
                    <Star className="w-5 h-5 text-[#F59E0B] mx-auto mb-1" />
                    <p className="text-sm font-bold text-[#1E293B]">{studentDetail.profile?.totalXp || 0}</p>
                    <p className="text-[10px] text-[#94A3B8]">Total XP</p>
                  </div>
                  <div className="text-center p-3 bg-[#F0F9FF] rounded-xl">
                    <Flame className="w-5 h-5 text-[#F43F5E] mx-auto mb-1" />
                    <p className="text-sm font-bold text-[#1E293B]">{studentDetail.profile?.currentStreak || 0}</p>
                    <p className="text-[10px] text-[#94A3B8]">Streak</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
