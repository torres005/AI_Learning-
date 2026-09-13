import { Link } from "react-router";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src="/hero-robot.png" alt="Lost robot" className="w-32 h-auto mx-auto mb-6 opacity-50" />
        <h1 className="text-6xl font-extrabold text-[#3B82F6] mb-2" style={{ fontFamily: "Nunito, sans-serif" }}>404</h1>
        <h2 className="text-xl font-bold text-[#1E293B] mb-3">Page Not Found</h2>
        <p className="text-[#64748B] mb-6">Oops! The page you're looking for doesn't exist. Let me help you find your way back.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] font-semibold rounded-full hover:bg-[#F8FAFC] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] text-white font-semibold rounded-full hover:bg-[#2563EB] transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
