import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BookMarked, Plus, X, Clock, Star, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherHomework() {
  const { data: classroomData } = trpc.teacher.getClassrooms.useQuery();
  const { data: homeworkData, isLoading } = trpc.homework.list.useQuery();
  const utils = trpc.useUtils();

  const [showForm, setShowForm] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("AI");
  const [dueDate, setDueDate] = useState("");
  const [xpReward, setXpReward] = useState(50);
  
  const [selectedHomework, setSelectedHomework] = useState<number | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const createMutation = trpc.homework.create.useMutation({
    onSuccess: () => { utils.homework.list.invalidate(); setShowForm(false); resetForm(); },
  });

  const { data: submissionsData } = trpc.homework.getSubmissions.useQuery(
    { homeworkId: selectedHomework || 0 },
    { enabled: !!selectedHomework }
  );

  const gradeMutation = trpc.homework.grade.useMutation({
    onSuccess: () => { utils.homework.list.invalidate(); setGrade(""); setFeedback(""); },
  });

  const resetForm = () => {
    setTitle(""); setDescription(""); setSubject("AI"); setDueDate(""); setXpReward(50); setSelectedClassroom(0);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassroom || !title || !dueDate) return;
    createMutation.mutate({ classroomId: selectedClassroom, title, description, subject, dueDate, xpReward });
  };

  const now = new Date();

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1E293B]" style={{ fontFamily: "Nunito, sans-serif" }}>Homework</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white font-semibold rounded-full hover:bg-[#059669] transition-colors text-sm"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "New Assignment"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <motion.form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl p-5 shadow-sm space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-[#1E293B] mb-2">Create Homework</h3>
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Classroom</label>
              <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none">
                <option value={0}>Select classroom...</option>
                {classroomData?.classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title"
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., AI Basics"
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Assignment details..." rows={3}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Due Date</label>
                <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">XP Reward</label>
                <input type="number" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} min={10} max={500}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none" />
              </div>
            </div>
            <button type="submit" disabled={createMutation.isPending || !selectedClassroom || !title || !dueDate}
              className="w-full py-2.5 bg-[#10B981] text-white font-semibold rounded-full hover:bg-[#059669] transition-colors disabled:opacity-50">
              {createMutation.isPending ? "Creating..." : "Create & Assign"}
            </button>
          </motion.form>
        )}

        {/* Homework List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : homeworkData?.homework.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <BookMarked className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B]">No homework assignments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {homeworkData?.homework.map((hw: any, i: number) => (
              <motion.div
                key={hw.id}
                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${new Date(hw.dueDate) < now ? "border-red-400" : "border-[#10B981]"}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1E293B] text-sm">{hw.title}</h4>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{hw.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(hw.dueDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F59E0B]" />{hw.xpReward} XP</span>
                      <span className="capitalize px-1.5 py-0.5 rounded bg-[#F0F9FF] text-[#3B82F6] font-semibold">{hw.subject}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedHomework(hw.id === selectedHomework ? null : hw.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#10B981] bg-[#10B981]/5 rounded-full hover:bg-[#10B981]/10 transition-colors"
                  >
                    {selectedHomework === hw.id ? "Hide" : "Grade"}
                  </button>
                </div>

                {/* Submissions */}
                <AnimatePresence>
                  {selectedHomework === hw.id && submissionsData && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-[#F1F5F9]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h5 className="font-semibold text-[#1E293B] text-sm mb-3">Submissions</h5>
                      {submissionsData.submissions.length === 0 ? (
                        <p className="text-xs text-[#94A3B8] py-2">No submissions yet</p>
                      ) : (
                        <div className="space-y-3">
                          {submissionsData.submissions.map((sub) => (
                            <div key={sub.id} className="bg-[#F8FAFC] rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#1E293B]">{sub.studentName}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  sub.status === "graded" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                                }`}>
                                  {sub.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#64748B] mb-2 line-clamp-2">{sub.content}</p>
                              {sub.status === "graded" ? (
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-bold text-[#10B981]">Grade: {sub.grade}</span>
                                  {sub.feedback && <span className="text-[#64748B]">- {sub.feedback}</span>}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade (A-F)"
                                      className="w-20 px-2 py-1.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-1 focus:ring-[#10B981] outline-none" />
                                    <input type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback"
                                      className="flex-1 px-2 py-1.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-1 focus:ring-[#10B981] outline-none" />
                                    <button
                                      onClick={() => gradeMutation.mutate({ submissionId: sub.id, grade, feedback })}
                                      disabled={gradeMutation.isPending || !grade}
                                      className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-sm font-semibold hover:bg-[#059669] disabled:opacity-50"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
