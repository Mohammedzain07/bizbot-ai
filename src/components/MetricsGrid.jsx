import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, Store,
  AlertTriangle, ShieldCheck, UserX, DollarSign,
} from "lucide-react";

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

function MetricCard({ icon: Icon, label, value, sub, trend, trendLabel, color, loading, index }) {
  const colorMap = {
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-100" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100" },
    violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={CARD_VARIANTS}
      className="card p-5 hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={16} className={c.icon} strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            trend > 0
              ? "bg-emerald-50 text-emerald-700"
              : trend < 0
              ? "bg-red-50 text-red-600"
              : "bg-slate-50 text-slate-500"
          }`}>
            {trend > 0 ? (
              <TrendingUp size={11} strokeWidth={2.5} />
            ) : trend < 0 ? (
              <TrendingDown size={11} strokeWidth={2.5} />
            ) : null}
            <span>{trendLabel || `${trend > 0 ? "+" : ""}${trend}%`}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-28 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="font-display text-2xl font-700 text-slate-900 tracking-tight mb-0.5">
            {value}
          </p>
          <p className="text-sm text-slate-500">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </>
      )}
    </motion.div>
  );
}

export default function MetricsGrid({ summary, loading = false }) {
  const formatRevenue = (val) => {
    if (!val) return "₹0";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val?.toLocaleString("en-IN")}`;
  };

  const metrics = [
    {
      icon: DollarSign,
      label: "Total Monthly Revenue",
      value: formatRevenue(summary?.total_monthly_revenue),
      trend: summary?.revenue_growth_pct,
      sub: `vs ₹${(((summary?.total_monthly_revenue || 0) / (1 + (summary?.revenue_growth_pct || 0) / 100)) / 100000).toFixed(1)}L last month`,
      color: "indigo",
    },
    {
      icon: Users,
      label: "Active Customers",
      value: summary?.total_active_customers?.toLocaleString("en-IN") ?? "—",
      sub: `Avg ${summary?.avg_retention_rate}% retention rate`,
      color: "blue",
    },
    {
      icon: Store,
      label: "Total Merchants",
      value: summary?.total_merchants ?? "—",
      trendLabel: `${summary?.merchants_thriving} thriving`,
      trend: 1,
      sub: `Across 4 categories`,
      color: "violet",
    },
    {
      icon: ShieldCheck,
      label: "Avg Retention Rate",
      value: `${summary?.avg_retention_rate}%`,
      sub: "Platform-wide average",
      trend: 0.8,
      trendLabel: "+0.8%",
      color: "emerald",
    },
    {
      icon: AlertTriangle,
      label: "Merchants at Risk",
      value: summary?.merchants_at_risk ?? "—",
      sub: "Churn risk score ≥ 35",
      trend: -1,
      trendLabel: "Needs attention",
      color: "amber",
    },
    {
      icon: UserX,
      label: "Inactive VIP Customers",
      value: summary?.vip_customers_inactive ?? "—",
      sub: "30+ days no visit",
      trend: -1,
      trendLabel: "Win-back needed",
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {metrics.map((m, i) => (
        <MetricCard key={m.label} {...m} loading={loading} index={i} />
      ))}
    </div>
  );
}
