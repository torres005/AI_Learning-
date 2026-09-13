import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { Sparkles, ArrowLeft, Eye, EyeOff, Users, UserCheck, GraduationCap, Lock, User, Mail, BookOpen } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<"child" | "parent" | "teacher">(
    (searchParams.get("role") as "child" | "parent" | "teacher") || "child"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState<"5-8" | "8-12" | "12-16">("8-12");
  const [subject, setSubject] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = trpc.user.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      navigate(role === "child" ? "/child" : role === "parent" ? "/parent" : "/teacher");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password || !fullName) {
      setError("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    registerMutation.mutate({
      role,
      username,
      password,
      fullName,
      email: email || undefined,
      ageGroup: role === "child" ? ageGroup : undefined,
      subject: role === "teacher" ? subject : undefined,
    });
  };

  const roles = [
    { key: "child" as const, icon: Users, label: "Student", color: "#3B82F6", hoverGlow: "shadow-glow-blue" },
    { key: "parent" as const, icon: UserCheck, label: "Parent", color: "#8B5CF6", hoverGlow: "shadow-glow-purple" },
    { key: "teacher" as const, icon: GraduationCap, label: "Teacher", color: "#10B981", hoverGlow: "shadow-glow-green" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-body">
      {/* Background decoration - Glowing Blobs for Register */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full bg-blue-300/25 blur-[110px]"
          style={{ top: "-5%", left: "40%" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-[#10B981]/15 blur-[100px]"
          style={{ bottom: "-10%", right: "15%" }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-emerald-600 to-indigo-600 items-center justify-center relative overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
            </motion.div>
          ))}
        </div>
        <div className="relative z-10 text-center px-16 space-y-6">
          <motion.div
            className="w-48 h-48 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <img src="/hero-robot.png" alt="Robot mascot" className="w-36 h-auto drop-shadow-lg" />
          </motion.div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Join the Adventure!
            </h2>
            <p className="text-white/80 text-base max-w-sm mx-auto leading-relaxed">
              Create an account and access personalized paths for learning artificial intelligence through games.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative z-10 overflow-y-auto">
        <motion.div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-bold text-xs transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Let's Sign Up!
            </h1>
            <p className="text-slate-400 text-sm mt-1">Select your path and create your profile</p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-2.5 p-1 bg-slate-100 rounded-2xl mb-6">
            {roles.map((r) => {
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    active ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                  style={active ? { backgroundColor: r.color } : {}}
                >
                  <r.icon className="w-3.5 h-3.5" />
                  {r.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                  placeholder="Your full name" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Username *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                  placeholder="Choose a username" />
              </div>
            </div>

            {role === "parent" && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                    placeholder="parent@email.com" />
                </div>
              </div>
            )}

            {role === "teacher" && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                      placeholder="teacher@email.com" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Focus</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                      placeholder="e.g., Computer Science" />
                  </div>
                </div>
              </>
            )}

            {role === "child" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Age Group *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["5-8", "8-12", "12-16"] as const).map((ag) => {
                    const active = ageGroup === ag;
                    return (
                      <button key={ag} type="button" onClick={() => setAgeGroup(ag)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}>
                        Ages {ag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                  placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div className="p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs font-semibold border border-red-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={registerMutation.isPending}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 text-sm mt-4">
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

