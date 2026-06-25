import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, ArrowRight } from "lucide-react";

export default function HeroSection({ summary, loading = false }) {
  const growth = summary?.revenue_growth_pct ?? 0;
  const isPositive = growth >= 0;

  const formatRevenue = (val) => {
    if (!val) return "₹0";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-8 mb-6"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-4 right-32 w-32 h-32 rounded-full bg-violet-500/20" />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: Greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-indigo-200 text-sm font-medium">Executive Overview</span>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-700 text-white mb-1 tracking-tight">
            Good morning, Siddharth 👋
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-md">
            Your merchant network is{" "}
            <span className="text-white font-medium">
              {isPositive ? "growing" : "facing headwinds"}
            </span>{" "}
            this month.{" "}
            {summary?.merchants_at_risk > 0
              ? `${summary.merchants_at_risk} merchant${summary.merchants_at_risk > 1 ? "s" : ""} need attention.`
              : "All merchants are on track."}
          </p>
        </div>

        {/* Right: Key Metrics Highlight */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Revenue */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[150px] border border-white/10">
            <p className="text-indigo-200 text-xs font-medium mb-1">Total Revenue</p>
            {loading ? (
              <div className="h-7 w-24 bg-white/20 rounded animate-pulse" />
            ) : (
              <>
                <p className="font-display text-2xl font-700 text-white tracking-tight">
                  {formatRevenue(summary?.total_monthly_revenue)}
                </p>
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPositive ? "text-emerald-300" : "text-red-300"}`}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{isPositive ? "+" : ""}{growth}% vs last month</span>
                </div>
              </>
            )}
          </div>

          {/* Customers */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[140px] border border-white/10">
            <p className="text-indigo-200 text-xs font-medium mb-1">Active Customers</p>
            {loading ? (
              <div className="h-7 w-20 bg-white/20 rounded animate-pulse" />
            ) : (
              <>
                <p className="font-display text-2xl font-700 text-white tracking-tight">
                  {summary?.total_active_customers?.toLocaleString("en-IN") ?? "—"}
                </p>
                <p className="text-indigo-200 text-xs mt-1">
                  Avg {summary?.avg_retention_rate}% retention
                </p>
              </>
            )}
          </div>

          {/* Merchants */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[130px] border border-white/10">
            <p className="text-indigo-200 text-xs font-medium mb-1">Merchants</p>
            {loading ? (
              <div className="h-7 w-16 bg-white/20 rounded animate-pulse" />
            ) : (
              <>
                <p className="font-display text-2xl font-700 text-white tracking-tight">
                  {summary?.total_merchants ?? "—"}
                </p>
                <p className="text-indigo-200 text-xs mt-1">
                  <span className="text-emerald-300">{summary?.merchants_thriving} thriving</span>
                  {" · "}
                  <span className="text-amber-300">{summary?.merchants_at_risk} at risk</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
        <span className="text-indigo-200 text-xs">Quick Actions:</span>
        {[
          "View AI Alerts",
          "Run Campaigns",
          "Export Report",
        ].map((action) => (
          <button
            key={action}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg px-3 py-1.5 transition-colors"
          >
            {action}
            <ArrowRight size={11} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
