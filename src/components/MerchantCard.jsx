import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, MapPin, Users, ChevronRight } from "lucide-react";
import { CATEGORY_META, HEALTH_META } from "../data/merchants";

function HealthBadge({ status }) {
  const meta = HEALTH_META[status] || HEALTH_META.stable;
  const colorMap = {
    thriving: "bg-emerald-50 text-emerald-700 border-emerald-200",
    stable: "bg-blue-50 text-blue-700 border-blue-200",
    at_risk: "bg-amber-50 text-amber-700 border-amber-200",
    critical: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colorMap[status] || colorMap.stable}`}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      {meta.label}
    </span>
  );
}

function MiniBar({ value, max, color = "indigo" }) {
  const pct = Math.min((value / max) * 100, 100);
  const colorMap = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={`h-full rounded-full ${colorMap[color] || colorMap.indigo}`}
      />
    </div>
  );
}

export default function MerchantCard({ merchant, index = 0, onSelect }) {
  const catMeta = CATEGORY_META[merchant.category] || {};
  const isPositive = merchant.revenue_growth_pct >= 0;

  const formatRevenue = (val) => {
    if (!val) return "₹0";
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const retentionColor =
    merchant.retention_rate >= 88
      ? "emerald"
      : merchant.retention_rate >= 84
      ? "indigo"
      : "amber";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect?.(merchant)}
      className="card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* Category emoji */}
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
            {catMeta.emoji || "🏪"}
          </div>
          <div>
            <h4 className="font-display font-700 text-slate-900 text-[15px] tracking-tight leading-snug">
              {merchant.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} className="text-slate-400" />
              <span className="text-xs text-slate-400">{merchant.city}</span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400 capitalize">{merchant.category}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <HealthBadge status={merchant.health_status} />
          <div className="flex items-center gap-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-slate-600">{merchant.rating}</span>
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Monthly Revenue</p>
          <p className="font-display text-xl font-700 text-slate-900 tracking-tight">
            {formatRevenue(merchant.monthly_revenue)}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
          {isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
          <span>{isPositive ? "+" : ""}{merchant.revenue_growth_pct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">Customers</p>
          <p className="text-sm font-semibold text-slate-800">
            {merchant.total_customers.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">New</p>
          <p className="text-sm font-semibold text-slate-800">{merchant.new_customers}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">VIP Inactive</p>
          <p className={`text-sm font-semibold ${merchant.vip_inactive_30d > 8 ? "text-red-600" : "text-slate-800"}`}>
            {merchant.vip_inactive_30d}
          </p>
        </div>
      </div>

      {/* Retention Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Users size={10} />
            Retention Rate
          </p>
          <p className="text-xs font-semibold text-slate-700">{merchant.retention_rate}%</p>
        </div>
        <MiniBar value={merchant.retention_rate} max={100} color={retentionColor} />
      </div>

      {/* AI Insights Count & CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {merchant.ai_insights?.length > 0 ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-500">
                {merchant.ai_insights.length} AI insight{merchant.ai_insights.length > 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-500">On track</span>
            </>
          )}
        </div>
        <span className="text-xs font-medium text-indigo-600 group-hover:text-indigo-700 flex items-center gap-0.5 transition-colors">
          Details
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </motion.div>
  );
}
