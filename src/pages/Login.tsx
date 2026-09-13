import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { Sparkles, ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.user.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      const role = data.user.role;
      navigate(role === "child" ? "/child" : role === "parent" ? "/parent" : "/teacher");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-body">
      {/* Background decoration - Glowing Blobs for Login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-300/30 blur-[100px]"
          style={{ top: "10%", left: "45%" }}
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full bg-[#8B5CF6]/20 blur-[100px]"
          style={{ bottom: "10%", right: "10%" }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 items-center justify-center relative overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
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
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <img src="/hero-robot.png" alt="Robot mascot" className="w-36 h-auto drop-shadow-lg" />
          </motion.div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Welcome Back!
            </h2>
            <p className="text-white/80 text-base max-w-sm mx-auto leading-relaxed">
              Every log-in is a step forward in your learning adventure. Let's see what you will build today!
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative z-10">
        <motion.div
          className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-bold text-xs transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Let's Sign In!
            </h1>
            <p className="text-slate-400 text-sm mt-1">Ready to unlock your dashboard and study boards?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all bg-white/50 focus:bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className="p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs font-semibold border border-red-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 text-sm mt-2"
            >
              {loginMutation.isPending ? "Signing in..." : "Continue to Dashboard"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-400">
              New here?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

