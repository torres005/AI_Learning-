import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Send, Bot, User, Trash2, Sparkles, Brain, Code, Globe, BookOpen } from "lucide-react";

const quickTopics = [
  { label: "What is AI?", icon: Brain },
  { label: "Machine Learning Basics", icon: Sparkles },
  { label: "Python Coding Intro", icon: Code },
  { label: "AI Ethics for Kids", icon: Globe },
  { label: "Help with Homework", icon: BookOpen },
];

export default function ChildAITutor() {
  const { data: history } = trpc.aiTutor.getHistory.useQuery();
  const chatMutation = trpc.aiTutor.chat.useMutation();
  const clearMutation = trpc.aiTutor.clearHistory.useMutation();
  const utils = trpc.useUtils();

  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<{ message: string; response: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allMessages = [...(history?.messages.map((m: any) => ({ message: m.message, response: m.response })) || []), ...localMessages];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isTyping]);

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    setMessage("");
    setIsTyping(true);

    try {
      const result = await chatMutation.mutateAsync({ message: msg });
      setLocalMessages(prev => [...prev, { message: msg, response: result.response }]);
      utils.aiTutor.getHistory.invalidate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
         setLocalMessages([]);
         utils.aiTutor.getHistory.invalidate();
      },
    });
  };

  return (
    <DashboardLayout role="child">
      <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden relative">
        
        {/* Decorative ambient glowing circle in chat */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-100/40 rounded-full blur-xl pointer-events-none" />

        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/60 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Bot className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Personal AI Tutor</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ready to help</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-slate-150 bg-white shadow-sm"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Viewport */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-slate-50/50 relative z-10">
          {allMessages.length === 0 && (
            <motion.div
              className="text-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25 animate-float">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                Let's Explore AI Together!
              </h3>
              <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
                Stuck on a homework puzzle, coding logic, or just curious how machine learning works? Ask me anything below!
              </p>

              {/* Quick Topics Pills */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {quickTopics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => handleSend(topic.label)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200/60 rounded-full text-xs font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all"
                  >
                    <topic.icon className="w-3.5 h-3.5" />
                    {topic.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {allMessages.map((msg, i) => (
              <div key={i} className="space-y-4">
                {/* User Bubble */}
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className="bg-blue-600 text-white px-4.5 py-3 rounded-2xl rounded-tr-none text-xs font-semibold leading-relaxed shadow-md shadow-blue-500/10">
                      {msg.message}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                      <User className="w-4.5 h-4.5 text-slate-500" />
                    </div>
                  </div>
                </motion.div>

                {/* AI Bubble */}
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-100 text-slate-800 px-4.5 py-3 rounded-2xl rounded-tl-none text-xs font-semibold leading-relaxed shadow-sm whitespace-pre-wrap">
                      {msg.response}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div className="flex items-start gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 px-4.5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center justify-center">
                <div className="flex gap-1 py-1 px-1">
                  <motion.div className="w-2.5 h-2.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                  <motion.div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                  <motion.div className="w-2.5 h-2.5 bg-blue-300 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Textbar Panel */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white relative z-10">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(message)}
              placeholder="Type your question here (e.g. explain machine learning to a 6 year old)..."
              className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder-slate-400"
            />
            <button
              onClick={() => handleSend(message)}
              disabled={!message.trim() || isTyping}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

