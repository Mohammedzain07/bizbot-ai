import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, TrendingDown, TrendingUp, Users, UserPlus,
  Package, Heart, Shield, MapPin, ShoppingCart,
  ChevronRight, AlertCircle, Sparkles, Filter,
} from "lucide-react";

const ICON_MAP = {
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  "users": Users,
  "user-plus": UserPlus,
  "package": Package,
  "heart": Heart,
  "shield": Shield,
  "map-pin": MapPin,
  "shopping-cart": ShoppingCart,
  "alert-circle": AlertCircle,
};

const SEVERITY_STYLES = {
  high: {
    border: "border-red-200",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    icon: "text-red-500",
    dot: "bg-red-500",
    label: "High Priority",
  },
  medium: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    icon: "text-amber-500",
    dot: "bg-amber-500",
    label: "Medium Priority",
  },
  low: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "text-emerald-500",
    dot: "bg-emerald-500",
    label: "Opportunity",
  },
};

const TYPE_LABELS = {
  retention_alert: "Retention",
  revenue_alert: "Revenue",
  growth_opportunity: "Growth",
  campaign: "Campaign",
  branch_alert: "Branch",
};

function InsightCard({ insight, index }) {
  const [expanded, setExpanded] = useState(false);
  const s = SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.low;
  const Icon = ICON_MAP[insight.icon] || AlertCircle;
  const typeLabel = TYPE_LABELS[insight.type] || insight.type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={`border ${s.border} rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-card-hover`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left p-4 ${s.bg} transition-colors`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex-shrink-0 ${s.icon}`}>
            <Icon size={16} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                {insight.title}
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                  {typeLabel}
                </span>
                <ChevronRight
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                />
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{insight.body}</p>
            {insight.merchant_name && (
              <p className="text-xs text-slate-400 mt-1">{insight.merchant_name}</p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white border-t border-slate-100 p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Recommended Action
                </p>
                <p className="text-sm text-slate-700">{insight.action}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Expected Impact
                </p>
                <p className="text-sm text-emerald-700 font-medium">{insight.impact}</p>
              </div>
              <button className="btn-primary text-xs py-2 px-4 w-full mt-1">
                Take Action →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AIInsightsPanel({ insights = [], loading = false }) {
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "All" },
    { key: "retention_alert", label: "Retention" },
    { key: "revenue_alert", label: "Revenue" },
    { key: "growth_opportunity", label: "Growth" },
    { key: "campaign", label: "Campaigns" },
  ];

  const filtered = filter === "all"
    ? insights
    : insights.filter((i) => i.type === filter);

  const highCount = insights.filter((i) => i.severity === "high").length;

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Sparkles size={15} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-display font-700 text-slate-900 text-sm tracking-tight">
              AI Insights
            </h3>
            <p className="text-xs text-slate-400">
              {loading ? "Analyzing…" : `${insights.length} insights · ${highCount} high priority`}
            </p>
          </div>
        </div>
        <button className="btn-ghost text-xs flex items-center gap-1.5 py-1.5">
          <Filter size={12} />
          Filter
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              filter === key
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Insights List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8">
          <Zap size={24} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No insights in this category</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((insight, i) => (
            <InsightCard
              key={`${insight.merchant_id}-${i}`}
              insight={insight}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
