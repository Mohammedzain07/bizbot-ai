import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import Logo, { LogoMark } from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    // Simulate auth — replace with real auth in production
    await new Promise((res) => setTimeout(res, 900));
    setLoading(false);
    navigate("/dashboard");
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setLoading(false);
    navigate("/dashboard");
  };

  const handleDemo = async () => {
    setEmail("demo@bizbot.ai");
    setPassword("demo1234");
    setLoading(true);
    await new Promise((res) => setTimeout(res, 700));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-between w-[480px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-12 relative overflow-hidden flex-shrink-0"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-800/30" />
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-auth" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-auth)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative">
          <Logo size="md" variant="full" className="[&_span]:text-white [&_span:last-child]:text-indigo-200" />
        </div>

        {/* Tagline */}
        <div className="relative">
          <h2 className="font-display text-4xl font-800 text-white leading-tight tracking-tight mb-6">
            Your AI executive
            <br />
            operating system
          </h2>
          <p className="text-indigo-200 leading-relaxed mb-10">
            Real-time merchant intelligence. Retention alerts. Campaign recommendations. Built for local business operators who run on results.
          </p>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              "Revenue intelligence & anomaly detection",
              "VIP customer retention alerts",
              "AI-generated campaign recommendations",
              "Branch performance monitoring",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-300" />
                </div>
                <span className="text-indigo-100 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative border-t border-white/15 pt-6">
          <p className="text-indigo-200 text-sm italic leading-relaxed">
            "BizBot AI is the operating layer I always wished existed for my salon chain."
          </p>
          <p className="text-indigo-300 text-xs mt-2">— Priya M., Luxe Beauty Studio</p>
        </div>
      </motion.div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center mb-10 justify-center">
            <Logo size="md" variant="full" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-800 text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to your merchant intelligence dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-600"
            >
              <AlertCircle size={15} />
              {error}
            </motion.div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 mb-5 shadow-card"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourstore.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2 shadow-md shadow-indigo-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo CTA */}
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-xs text-indigo-600 font-medium mb-2">
              👋 Want to explore without signing up?
            </p>
            <button
              onClick={handleDemo}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              Launch Demo Dashboard
              <ArrowRight size={12} />
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-indigo-600 font-medium hover:text-indigo-700">
              Start free trial
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
