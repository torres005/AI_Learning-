import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Users, GraduationCap, UserCheck, Flame, Star, Bot, Trophy,
  MessageSquare, Mail, Phone, MapPin, CheckCircle2, ChevronDown, Send
} from "lucide-react";

export default function Landing() {
  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Contact Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setMessage("");
      }, 5000);
    }
  };

  const faqs = [
    {
      q: "What age groups is the Smart Learning Adventure platform designed for?",
      a: "Our platform features customized paths for children ages 5-16. We divide learning tracks into three segments: ages 5-8 (playful basic logic & puzzles), ages 8-12 (interactive chatbot coding & games), and ages 12-16 (advanced machine learning and real coding with Python)."
    },
    {
      q: "How does the Parent Dashboard work?",
      a: "Parents can link their accounts to their children's profiles. From the Parent Dashboard, you can track daily streaks, view comprehensive progress graphs, assign custom tasks (like doing math puzzles or cleaning their room) with XP and star rewards, and download weekly reports."
    },
    {
      q: "What benefits does the Teacher Dashboard provide?",
      a: "Teachers can create virtual classrooms and generate unique join codes (e.g. AI-9943). You can manage students, assign customized homework modules, track class-wide XP, view streak rankings, and analyze classroom performance metrics through rich graphs."
    },
    {
      q: "Is there a real AI involved in the platform?",
      a: "Yes! Every student gets a dedicated, age-appropriate AI Tutor. Powered by advanced AI models, the tutor acts as an on-demand study companion that helps children understand concepts, solves coding challenges step-by-step, and provides instant encouragement."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-body text-slate-800 scroll-smooth">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        
        {/* Colorful glowing ambient blobs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-300/30 blur-[130px]"
          style={{ top: "-10%", left: "-10%" }}
          animate={{ x: [0, 50, 0], y: [0, 40, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-300/25 blur-[120px]"
          style={{ top: "35%", right: "-10%" }}
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full bg-emerald-200/20 blur-[110px]"
          style={{ bottom: "10%", left: "20%" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/70 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Smart Learning Adventure
            </span>
          </a>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-100/80 rounded-full transition-all text-sm">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          className="flex-1 text-center lg:text-left space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-black text-blue-600 shadow-sm animate-pulse-subtle">
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            Gamified AI Learning Platform
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
            style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em" }}
          >
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI</span>.<br />
            Have Fun.<br />
            Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Smart</span>.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-body">
            Empower children aged 5-16 to master the fundamentals of Artificial Intelligence, programming, and basic logic through custom interactive worlds and an on-demand AI Tutor.
          </p>

          {/* Role Selection */}
          <div className="pt-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center lg:text-left">
              Choose your adventure path:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <RoleCard
                to="/register"
                role="child"
                avatar="/child-avatar-1.png"
                title="I'm a Student"
                subtitle="Play games & earn XP"
                color="from-blue-600 to-indigo-600"
                hoverShadow="shadow-glow-blue"
              />
              <RoleCard
                to="/register"
                role="parent"
                avatar="/parent-avatar.png"
                title="I'm a Parent"
                subtitle="Track progress & tasks"
                color="from-purple-500 to-pink-500"
                hoverShadow="shadow-glow-purple"
              />
              <RoleCard
                to="/register"
                role="teacher"
                avatar="/teacher-avatar.png"
                title="I'm a Teacher"
                subtitle="Manage classes & homework"
                color="from-emerald-500 to-teal-500"
                hoverShadow="shadow-glow-green"
              />
            </div>
          </div>
        </motion.div>

        {/* Hero Illustration Side */}
        <motion.div
          className="flex-1 w-full max-w-lg relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Floating Glassmorphic Badges */}
          <div className="absolute -top-6 -left-6 z-20 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/40 animate-float">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">5-Day Streak!</p>
              <p className="text-[10px] text-slate-400 font-bold">Keep learning, keep glowing</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-4 z-20 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/40 animate-float" style={{ animationDelay: "1.5s" }}>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">AI Tutor Active</p>
              <p className="text-[10px] text-blue-600 font-black">Ready to guide you!</p>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center">
            <img
              src="/landing-illustration.jpg"
              alt="AI learning hub illustration"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback inside react if image does not load
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600";
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Us (Our Mission) Section */}
      <section id="about" className="py-20 relative z-10 bg-white border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Our Mission
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-3 rounded-full" />
            <p className="text-slate-500 mt-4 leading-relaxed font-body">
              Preparing the next generation for an AI-driven future. We turn complex technical concepts into fun, visual, and gamified adventures that kids love.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                AI Education Made Playful, Safe, and Collaborative
              </h3>
              <p className="text-slate-500 leading-relaxed font-body">
                We believe that learning about technology shouldn't feel like a chore. Our structured, adaptive curriculum adapts to different developmental levels, introducing basic coding concepts to 5-year-olds and advanced neural networks to teenagers.
              </p>
              
              {/* Checkpoints */}
              <div className="space-y-3 pt-2">
                <Checkpoint text="Role-specific dashboards customized for Students, Parents, and Teachers." />
                <Checkpoint text="On-demand AI study companion with child-friendly prompt limits." />
                <Checkpoint text="Fun daily challenges, reward badges, and active learning streaks." />
              </div>
            </div>

            {/* Stat Counters Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatItem value="15,000+" label="Active Kid Explorers" desc="Learning AI concepts daily" color="bg-blue-50 border-blue-100 text-blue-600" />
              <StatItem value="98%" label="Parent Satisfaction" desc="Noticed improved logical skills" color="bg-purple-50 border-purple-100 text-purple-600" />
              <StatItem value="250+" label="Partner Schools" desc="Integrating our AI tracks" color="bg-emerald-50 border-emerald-100 text-emerald-600" />
              <StatItem value="1.2M+" label="XP Points Earned" desc="Rewarding consistency" color="bg-amber-50 border-amber-100 text-amber-600" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              How The Adventure Works
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-3 rounded-full" />
            <p className="text-slate-500 mt-4 leading-relaxed font-body">
              Designed as a collaborative ecosystem, aligning kids, parents, and teachers under a single unified dashboard model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="Students Learn & Play"
              desc="Kids log in, choose their age track, and start completing interactive chapters, answering quizzes, and chatting with their personal AI Tutor to earn XP."
              color="border-t-4 border-blue-500"
            />
            <StepCard
              step="2"
              icon={<UserCheck className="w-6 h-6 text-purple-600" />}
              title="Parents Guide & Support"
              desc="Parents track metrics in real time, assign homework/chores, reward task completion with bonus XP, and check custom progress dashboards."
              color="border-t-4 border-purple-500"
            />
            <StepCard
              step="3"
              icon={<GraduationCap className="w-6 h-6 text-emerald-600" />}
              title="Teachers Analyze & Lead"
              desc="Teachers create classrooms, monitor school performance boards, assign curriculum-based homework, and manage classroom rosters with join codes."
              color="border-t-4 border-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Courses / Age tracks Section */}
      <section id="courses" className="py-20 relative z-10 bg-slate-100 border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Age-Tailored Learning Tracks
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-3 rounded-full" />
            <p className="text-slate-500 mt-4 leading-relaxed font-body">
              Choose the perfect entry point. We customize course difficulty, quiz complexity, and tutor styles for each age group.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AgeTrackCard
              age="5-8 Years"
              title="Interactive Explorers"
              desc="Introductory logic games, visual assistant commands, pattern recognition, and basic machine learning concepts using cartoon representations."
              icon={<Sparkles className="w-8 h-8 text-blue-600" />}
              btnColor="bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
              tag="Basic Introduction"
              image="/course-ai-basics.jpg"
            />
            <AgeTrackCard
              age="8-12 Years"
              title="Code Builders"
              desc="Build functional chatbots, play prompt engineering games, train simple classifiers (image/text recognition), and solve ethics puzzles."
              icon={<Bot className="w-8 h-8 text-purple-600" />}
              btnColor="bg-purple-600 hover:bg-purple-700 shadow-purple-600/25"
              tag="Intermediate logic"
              image="/course-coding.jpg"
            />
            <AgeTrackCard
              age="12-16 Years"
              title="Future AI Creators"
              desc="Introduction to Python programming, basic neural network architecture, data science concepts, machine learning model building, and tech ethics."
              icon={<Trophy className="w-8 h-8 text-emerald-600" />}
              btnColor="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
              tag="Advanced Programming"
              image="/course-ml.jpg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-100 font-body">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 relative z-10 bg-gradient-to-b from-white to-[#F0F9FF] border-t border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Info panel */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 self-start shadow-sm">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                Get in Touch
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Connect With Our Study Advisors
              </h2>
              <p className="text-slate-500 leading-relaxed font-body">
                Have questions about our curriculums, school partnerships, or parent plans? Fill out the form, and our educational support team will get back to you within 24 hours.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Us</p>
                    <p className="text-sm font-semibold text-slate-800">support@smartlearningadventure.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Call Us</p>
                    <p className="text-sm font-semibold text-slate-800">+1 (800) 555-ADVENTURE</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Main Campus</p>
                    <p className="text-sm font-semibold text-slate-800">IT Park, Sitapura Industrial Area, Jaipur, Rajasthan, India, 302022</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form card */}
            <div className="relative">
              <motion.div
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Send a Message
                </h3>

                {submitted ? (
                  <motion.div
                    className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center space-y-3"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                    <h4 className="font-bold text-emerald-800 text-lg">Thank You!</h4>
                    <p className="text-xs text-emerald-600 leading-relaxed font-body">
                      Your message has been received. One of our educational advisors will contact you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi! I want to know more about the AI Basics course tracks..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm mt-4"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Intro */}
          <div className="space-y-4 md:col-span-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Smart Learning
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              A comprehensive gamified platform teaching artificial intelligence, logical reasoning, and programming to kids aged 5 to 16. Join us in shaping tomorrow's technology builders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              Explore Tracks
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold font-body">
              <li><Link to="/register?role=child" className="hover:text-blue-400 transition-colors">Explorer Path (Ages 5-8)</Link></li>
              <li><Link to="/register?role=child" className="hover:text-blue-400 transition-colors">Builder Path (Ages 8-12)</Link></li>
              <li><Link to="/register?role=child" className="hover:text-blue-400 transition-colors">Creator Path (Ages 12-16)</Link></li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold font-body">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Subscribe to get news about monthly challenges, new course releases, and AI updates for parents.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 text-white w-full"
              />
              <button
                onClick={() => alert("Subscribed! Thank you.")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shrink-0"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500 font-body">
          <p>© 2026 Smart Learning Adventure. All rights reserved. Made with love for young creators.</p>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({ to, role, avatar, title, subtitle, color, hoverShadow }: {
  to: string; role: string; avatar: string; title: string; subtitle: string; color: string; hoverShadow: string;
}) {
  return (
    <Link to={`${to}?role=${role}`} className="block h-full">
      <motion.div
        className={`bg-gradient-to-br ${color} text-white p-5 rounded-3xl cursor-pointer flex items-center gap-4 shadow-md relative overflow-hidden group hover:${hoverShadow} transition-all border border-white/10`}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
        
        {/* Profile Photo / Avatar */}
        <div className="w-14 h-14 rounded-full border-2 border-white/60 overflow-hidden bg-white/10 flex-shrink-0 shadow-inner relative z-10">
          <img src={avatar} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        
        {/* Text Details - Perfectly Aligned */}
        <div className="relative z-10 flex-1 min-w-0">
          <h4 className="font-extrabold text-base tracking-tight leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            {title}
          </h4>
          <p className="text-xs text-white/90 font-medium mt-1 leading-snug truncate">
            {subtitle}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

function Checkpoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      <span className="text-sm font-semibold text-slate-600 font-body">{text}</span>
    </div>
  );
}

function StatItem({ value, label, desc, color }: { value: string; label: string; desc: string; color: string }) {
  return (
    <div className={`p-5 rounded-2xl border text-center ${color} flex flex-col justify-center`}>
      <span className="text-3xl font-black block tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</span>
      <span className="text-xs font-bold text-slate-800 block mt-1">{label}</span>
      <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{desc}</span>
    </div>
  );
}

function StepCard({ step, icon, title, desc, color }: { step: string; icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <motion.div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 flex flex-col justify-between ${color} hover:shadow-md transition-shadow relative overflow-hidden group`}
      whileHover={{ y: -4 }}
    >
      <div className="absolute top-2 right-4 text-6xl font-black text-slate-100 select-none group-hover:text-slate-200 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
        0{step}
      </div>
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h4 className="font-bold text-slate-800 text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-body">{desc}</p>
      </div>
    </motion.div>
  );
}

function AgeTrackCard({ age, title, desc, icon, btnColor, tag, image }: { age: string; title: string; desc: string; icon: React.ReactNode; btnColor: string; tag: string; image: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/40 transition-all flex flex-col h-full group">
      <div className="h-44 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-full shadow-sm">
          {tag}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">{age}</span>
          </div>
          <h4 className="font-black text-slate-800 text-lg mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-6 font-body">{desc}</p>
        </div>
        <Link to={`/register?role=child`}>
          <button className={`w-full py-2.5 text-white font-bold rounded-full text-xs shadow-md transition-all ${btnColor}`}>
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

