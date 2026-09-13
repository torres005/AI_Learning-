import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, Lock, CheckCircle2, Play, Clock, Star, ChevronRight, FileText, Video, HelpCircle, Puzzle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function ChildCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");
  const { data, isLoading, refetch } = trpc.course.getById.useQuery({ id: courseId });
  const startMutation = trpc.course.start.useMutation({ onSuccess: () => refetch() });
  const completeMutation = trpc.lesson.complete.useMutation({ onSuccess: () => refetch() });
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => startMutation.mutate({ courseId });

  const handleCompleteLesson = (lessonId: number) => {
    completeMutation.mutate({ lessonId });
    setSelectedLesson(null);
    setShowResult(false);
    setQuizAnswers({});
  };

  const handleQuizSubmit = (lessonId: number) => {
    // Calculate score
    const content = data?.lessons.find((l: any) => l.id === lessonId)?.content as { quizQuestions?: { correct: number }[] } | null;
    if (!content?.quizQuestions) return;
    
    let correct = 0;
    content.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct++;
    });
    const score = Math.round((correct / content.quizQuestions.length) * 100);
    setShowResult(true);
    
    if (score >= 50) {
      setTimeout(() => handleCompleteLesson(lessonId), 1500);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "quiz": return HelpCircle;
      case "interactive": return Puzzle;
      default: return FileText;
    }
  };

  if (isLoading) return <DashboardLayout role="child"><CourseSkeleton /></DashboardLayout>;
  if (!data) return <DashboardLayout role="child"><div className="text-center py-16">Course not found</div></DashboardLayout>;

  const { course, lessons, progress, lessonStatuses } = data;
  const hasStarted = !!progress;

  return (
    <DashboardLayout role="child">
      <div className="space-y-6">
        {/* Course Header */}
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-48 overflow-hidden">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <Link to="/child/courses" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Courses
            </Link>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>{course.title}</h1>
            <p className="text-white/80 text-sm mb-2">{course.description}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration} min</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{course.xpReward} XP</span>
              <span className="flex items-center gap-1">{lessons.length} lessons</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        {hasStarted && (
          <motion.div className="bg-white rounded-xl p-4 shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#1E293B]">Your Progress</span>
              <span className="text-sm font-bold text-[#3B82F6]">
                {Math.round((progress.completedLessons / progress.totalLessons) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.completedLessons / progress.totalLessons) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        {!hasStarted && (
          <motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white font-bold rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-lg"
            >
              {startMutation.isPending ? "Starting..." : "Start Learning!"}
            </button>
          </motion.div>
        )}

        {/* Lesson List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]" style={{ fontFamily: "Nunito, sans-serif" }}>Lessons</h2>
          {lessons.map((lesson: any, i: number) => {
            const status = lessonStatuses?.[lesson.id] || "locked";
            const Icon = getLessonIcon(lesson.type);
            const isSelected = selectedLesson === lesson.id;
            const cleanTitle = lesson.title.replace(/^Lesson \d+:\s*/i, "");

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                    status === "locked" ? "opacity-60" : "hover:shadow-md cursor-pointer"
                  } ${isSelected ? "ring-2 ring-[#3B82F6] shadow-glow-blue" : ""} ${
                    status === "completed" ? "border-l-4 border-[#10B981]" : ""
                  }`}
                  onClick={() => {
                    if (status !== "locked" && !isSelected) {
                      setSelectedLesson(lesson.id);
                      setShowResult(false);
                      setQuizAnswers({});
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status === "completed" ? "bg-[#10B981]/10" : status === "unlocked" ? "bg-[#3B82F6]/10" : "bg-[#F1F5F9]"
                    }`}>
                      {status === "completed" ? <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> :
                       status === "locked" ? <Lock className="w-5 h-5 text-[#94A3B8]" /> :
                       <Icon className="w-5 h-5 text-[#3B82F6]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1E293B] text-sm">{cleanTitle}</h3>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{lesson.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration} min</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{lesson.xpReward} XP</span>
                        <span className="capitalize px-1.5 py-0.5 rounded bg-[#F0F9FF] text-[#3B82F6] font-semibold">{lesson.type}</span>
                      </div>
                    </div>
                    {status === "unlocked" && !isSelected && (
                      <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
                    )}
                    {isSelected && (
                      <Play className="w-5 h-5 text-[#3B82F6]" />
                    )}
                  </div>

                  {/* Lesson Content */}
                  {isSelected && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-[#F1F5F9]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      {lesson.type === "quiz" ? (
                        <QuizContent
                          content={lesson.content as { quizQuestions?: { question: string; options: string[]; correct: number }[] }}
                          answers={quizAnswers}
                          setAnswers={setQuizAnswers}
                          showResult={showResult}
                          onSubmit={() => handleQuizSubmit(lesson.id)}
                        />
                      ) : (
                        <div className="space-y-5">
                          {/* YouTube redirect thumbnail play card */}
                          {(lesson.content as any)?.videoUrl && (() => {
                            const videoUrl = (lesson.content as any).videoUrl;
                            const watchUrl = videoUrl.replace("/embed/", "/watch?v=");
                            const videoIdMatch = videoUrl.match(/\/embed\/([^/?#]+)/);
                            const videoId = videoIdMatch ? videoIdMatch[1] : "";
                            const thumbnailUrl = videoId 
                              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                              : "/landing-illustration.jpg";

                            return (
                              <a
                                href={watchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md group border border-slate-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
                              >
                                <img
                                  src={thumbnailUrl}
                                  alt={cleanTitle}
                                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/landing-illustration.jpg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                                  </div>
                                  <span className="text-white text-xs font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 group-hover:bg-red-600 group-hover:border-red-500 transition-colors">
                                    Watch Lesson Video on YouTube
                                  </span>
                                </div>
                              </a>
                            );
                          })()}

                          {/* Renders interactive or project step info */}
                          {lesson.type === "interactive" && (lesson.content as any)?.interactiveSteps && (
                            <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4.5 space-y-2">
                              <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider">Activity Steps</h4>
                              <div className="space-y-1.5">
                                {((lesson.content as any).interactiveSteps as { step: string; type: string }[]).map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs text-blue-600 font-bold">
                                    <span className="w-5 h-5 rounded-full bg-blue-100/80 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{idx + 1}</span>
                                    <span className="leading-normal">{step.step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Complete Action Button */}
                          <div className="text-center pt-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCompleteLesson(lesson.id); }}
                              disabled={completeMutation.isPending}
                              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-md transition-all disabled:opacity-50 text-xs"
                            >
                              {completeMutation.isPending ? "Completing..." : `Complete Lesson (+${lesson.xpReward} XP)`}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

function QuizContent({
  content,
  answers,
  setAnswers,
  showResult,
  onSubmit,
}: {
  content: { quizQuestions?: { question: string; options: string[]; correct: number }[] };
  answers: Record<number, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  showResult: boolean;
  onSubmit: () => void;
}) {
  const questions = content.quizQuestions || [];
  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);
  
  let score = 0;
  if (showResult) {
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
  }

  return (
    <div className="space-y-4">
      {questions.map((q, qIdx) => (
        <div key={qIdx}>
          <p className="font-semibold text-[#1E293B] text-sm mb-2">{qIdx + 1}. {q.question}</p>
          <div className="space-y-1.5">
            {q.options.map((opt, oIdx) => {
              const isSelected = answers[qIdx] === oIdx;
              const isCorrect = showResult && oIdx === q.correct;
              const isWrong = showResult && isSelected && oIdx !== q.correct;
              
              return (
                <button
                  key={oIdx}
                  onClick={() => !showResult && setAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                  disabled={showResult}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                    isCorrect ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981]" :
                    isWrong ? "border-red-400 bg-red-50 text-red-600" :
                    isSelected ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]" :
                    "border-[#E2E8F0] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {showResult && (
        <div className={`text-center py-2 rounded-lg ${score === questions.length ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#FEF3C7] text-[#F59E0B]"}`}>
          <p className="font-bold">You scored {score}/{questions.length}!</p>
          {score >= Math.ceil(questions.length / 2) ? (
            <p className="text-sm">Great job! Lesson completed!</p>
          ) : (
            <p className="text-sm">Review and try again!</p>
          )}
        </div>
      )}

      {!showResult && (
        <button
          onClick={onSubmit}
          disabled={!allAnswered}
          className="w-full py-2 bg-[#3B82F6] text-white font-semibold rounded-full hover:bg-[#2563EB] transition-colors disabled:opacity-50"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    </div>
  );
}
