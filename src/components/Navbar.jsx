import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, ChevronDown } from "lucide-react";

export default function Navbar({ title = "Dashboard", subtitle = null }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center px-6 z-20 gap-4"
      style={{ left: "var(--sidebar-width)" }}
    >
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h1 className="font-display font-700 text-slate-900 text-lg tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <span className="text-sm text-slate-400 hidden sm:block">· {subtitle}</span>
          )}
        </div>
        <p className="text-xs text-slate-400 hidden md:block">{today}</p>
      </div>

      {/* Search */}
      <motion.div
        animate={{ width: searchFocused ? 280 : 200 }}
        transition={{ duration: 0.2 }}
        className="relative hidden md:block"
      >
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search merchants, insights…"
          className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:bg-white transition-all"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </motion.div>

      {/* AI Status Pill */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-soft" />
        <span className="text-xs font-medium text-indigo-600">AI Active</span>
      </div>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      {/* User Avatar */}
      <button className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">
          SR
        </div>
        <span className="text-sm font-medium text-slate-700 hidden sm:block">Siddharth</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
    </header>
  );
}
