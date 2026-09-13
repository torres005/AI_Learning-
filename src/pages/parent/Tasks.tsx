import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Plus, Trash2, CheckCircle2, Clock, Star, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentTasks() {
  const { data: dashboardData } = trpc.parent.getDashboard.useQuery();
  const { data: tasksData, isLoading } = trpc.task.list.useQuery();
  const utils = trpc.useUtils();

  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("AI");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [dueDate, setDueDate] = useState("");
  const [xpReward, setXpReward] = useState(50);

  const createMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      setShowForm(false);
      resetForm();
    },
  });

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  const statusMutation = trpc.task.updateStatus.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  const resetForm = () => {
    setTitle(""); setDescription(""); setSubject("AI"); setDifficulty("easy"); setDueDate(""); setXpReward(50);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !title || !dueDate) return;
    createMutation.mutate({ childId: selectedChild, title, description, subject, difficulty, dueDate, xpReward });
  };

  const now = new Date();
  const isOverdue = (due: Date | string) => new Date(due) < now;

  return (
    <DashboardLayout role="parent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1E293B]" style={{ fontFamily: "Nunito, sans-serif" }}>Tasks</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white font-semibold rounded-full hover:bg-[#7C3AED] transition-colors text-sm"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "New Task"}
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
            <h3 className="font-bold text-[#1E293B] mb-2">Create New Task</h3>
            
            {/* Child Select */}
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Assign to</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none"
              >
                <option value={0}>Select child...</option>
                {dashboardData?.children?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., AI Basics" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task details..." rows={2} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1">XP Reward</label>
                <input type="number" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} min={10} max={500} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#8B5CF6] outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || !selectedChild || !title || !dueDate}
              className="w-full py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-full hover:bg-[#7C3AED] transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create Task"}
            </button>
          </motion.form>
        )}

        {/* Tasks List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : tasksData?.tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Clock className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B]">No tasks yet. Create your first task above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasksData?.tasks.map((task: any, i: number) => (
              <motion.div
                key={task.id}
                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                  task.status === "confirmed" ? "border-[#10B981]" :
                  isOverdue(task.dueDate) && task.status !== "completed" ? "border-red-400" :
                  "border-[#8B5CF6]"
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#1E293B] text-sm">{task.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        task.status === "confirmed" ? "bg-[#10B981]/10 text-[#10B981]" :
                        task.status === "completed" ? "bg-[#3B82F6]/10 text-[#3B82F6]" :
                        task.status === "in_progress" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                        "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        {task.status}
                      </span>
                      {isOverdue(task.dueDate) && task.status !== "completed" && task.status !== "confirmed" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-semibold">Overdue</span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mb-2">{task.description}</p>
                    <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F59E0B]" />{task.xpReward} XP</span>
                      <span className="capitalize px-1.5 py-0.5 rounded bg-[#F0F9FF] font-semibold">{task.subject}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {task.status === "completed" && (
                      <button
                        onClick={() => statusMutation.mutate({ taskId: task.id, status: "confirmed" })}
                        className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded-lg transition-colors"
                        title="Confirm completion"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate({ taskId: task.id })}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
