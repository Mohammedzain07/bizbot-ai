import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MetricsGrid from "../components/MetricsGrid";
import AIInsightsPanel from "../components/AIInsightsPanel";
import MerchantCard from "../components/MerchantCard";
import {
  TrendingUp, TrendingDown, Megaphone, X, Star,
  MapPin, Users, DollarSign, Package, ChevronRight,
  Zap, ShieldCheck, BarChart3, ArrowUpRight,
} from "lucide-react";
import { api } from "../services/api";
import { CATEGORY_META, HEALTH_META } from "../data/merchants";

// ─── Campaign Card ────────────────────────────────────────────────────────────
function CampaignCard({ campaign, index }) {
  const priorityMap = {
    High: "badge-danger",
    Medium: "badge-warning",
    Low: "badge-neutral",
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-card transition-all duration-200 group"
    >
      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
        <Megaphone size={15} className="text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{campaign.title}</p>
          <span className={`${priorityMap[campaign.priority] || "badge-neutral"} flex-shrink-0 text-[10px]`}>
            {campaign.priority}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-2">{campaign.offer}</p>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="badge-info text-[10px]">{campaign.channel}</span>
          <span>ROI {campaign.expected_roi}</span>
          <span>Effort: {campaign.effort}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Merchant Detail Modal ────────────────────────────────────────────────────
function MerchantModal({ merchant, onClose }) {
  if (!merchant) return null;
  const catMeta = CATEGORY_META[merchant.category] || {};
  const healthMeta = HEALTH_META[merchant.health_status] || HEALTH_META.stable;
  const isPositive = merchant.revenue_growth_pct >= 0;
  const formatRevenue = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v?.toLocaleString("en-IN")}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
                {catMeta.emoji || "🏪"}
              </div>
              <div>
                <h3 className="font-display font-700 text-slate-900 text-lg tracking-tight">{merchant.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="text-sm text-slate-400">{merchant.city}</span>
                  <span className="text-slate-200">·</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${healthMeta.dot}15`,
                      color: healthMeta.dot,
                    }}
                  >
                    {healthMeta.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Revenue snapshot */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Monthly Revenue", value: formatRevenue(merchant.monthly_revenue) },
                { label: "Growth vs Last Month", value: `${isPositive ? "+" : ""}${merchant.revenue_growth_pct}%`, positive: isPositive },
                { label: "Avg Transaction", value: `₹${Math.round(merchant.avg_transaction_value)}` },
              ].map(({ label, value, positive }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className={`font-display text-xl font-700 tracking-tight ${positive !== undefined ? (positive ? "text-emerald-600" : "text-red-600") : "text-slate-900"}`}>
                    {value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Customer stats */}
            <div>
              <p className="section-label mb-3">Customer Intelligence</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Customers", value: merchant.total_customers.toLocaleString("en-IN") },
                  { label: "New This Month", value: merchant.new_customers },
                  { label: "VIP Members", value: merchant.vip_customers },
                  { label: "VIP Inactive 30d", value: merchant.vip_inactive_30d, warn: merchant.vip_inactive_30d > 8 },
                ].map(({ label, value, warn }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className={`font-display text-xl font-700 ${warn ? "text-red-600" : "text-slate-800"}`}>{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {merchant.ai_insights?.length > 0 && (
              <div>
                <p className="section-label mb-3">AI Insights ({merchant.ai_insights.length})</p>
                <div className="space-y-2">
                  {merchant.ai_insights.map((ins, i) => {
                    const sevColors = {
                      high: "bg-red-50 border-red-200 text-red-700",
                      medium: "bg-amber-50 border-amber-200 text-amber-700",
                      low: "bg-emerald-50 border-emerald-200 text-emerald-700",
                    };
                    return (
                      <div key={i} className={`p-3.5 rounded-xl border text-sm ${sevColors[ins.severity]}`}>
                        <p className="font-semibold mb-1">{ins.title}</p>
                        <p className="text-xs opacity-80">{ins.body}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Campaigns */}
            {merchant.campaign_recommendations?.length > 0 && (
              <div>
                <p className="section-label mb-3">Recommended Campaigns</p>
                <div className="space-y-2">
                  {merchant.campaign_recommendations.map((c, i) => (
                    <CampaignCard key={i} campaign={c} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const location = useLocation();
  const activeSection = location.pathname.replace("/dashboard", "").replace(/^\//, "") || "overview";

  const [merchants, setMerchants] = useState([]);
  const [insights, setInsights] = useState({ summary: null, top_alerts: [], all_insights: [] });
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [allCampaigns, setAllCampaigns] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, ins] = await Promise.all([api.getMerchants(), api.getInsights()]);
        setMerchants(m);
        setInsights(ins);
        // Flatten all campaigns
        const campaigns = m.flatMap((merchant) =>
          (merchant.campaign_recommendations || []).map((c) => ({
            ...c,
            merchant_name: merchant.name,
          }))
        );
        setAllCampaigns(campaigns.slice(0, 8));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredMerchants =
    categoryFilter === "all"
      ? merchants
      : merchants.filter((m) => m.category === categoryFilter);

  const categories = ["all", "salon", "restaurant", "gym", "supermarket"];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />

      <div
        className="flex flex-col min-h-screen"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <Navbar
          title={
            activeSection === "merchants" ? "Merchants" :
            activeSection === "insights" ? "AI Insights" :
            activeSection === "campaigns" ? "Campaigns" :
            activeSection === "retention" ? "Retention" :
            activeSection === "customers" ? "Customers" :
            activeSection === "growth" ? "Growth" :
            "Executive Dashboard"
          }
          subtitle={`${merchants.length} merchants · Live`}
        />

        {/* Main Content */}
        <main
          className="flex-1 px-6 pb-10"
          style={{ paddingTop: "calc(var(--navbar-height) + 24px)" }}
        >
          {/* ── Merchants Section ── */}
          {activeSection === "merchants" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display font-700 text-slate-900 text-xl tracking-tight mb-1">Merchants</h2>
                <p className="text-sm text-slate-500">{filteredMerchants.length} merchants · Click for detail</p>
              </div>
              {/* Category Filter */}
              <div className="flex gap-1.5 flex-wrap mb-5">
                {categories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                        categoryFilter === cat
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat === "all" ? "All" : `${meta?.emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                    </button>
                  );
                })}
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-52 bg-slate-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMerchants.map((m, i) => (
                    <MerchantCard
                      key={m.merchant_id}
                      merchant={m}
                      index={i}
                      onSelect={setSelectedMerchant}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── AI Insights Section ── */}
          {activeSection === "insights" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display font-700 text-slate-900 text-xl tracking-tight mb-1">AI Insights</h2>
                <p className="text-sm text-slate-500">AI-generated alerts and recommendations</p>
              </div>
              <AIInsightsPanel insights={insights.top_alerts} loading={loading} />
            </div>
          )}

          {/* ── Campaigns Section ── */}
          {activeSection === "campaigns" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display font-700 text-slate-900 text-xl tracking-tight mb-1">Campaigns</h2>
                <p className="text-sm text-slate-500">AI-generated · Ready to launch</p>
              </div>
              <div className="card p-5 max-w-3xl">
                <div className="space-y-2.5">
                  {loading
                    ? [1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                      ))
                    : allCampaigns.map((c, i) => (
                        <CampaignCard key={i} campaign={c} index={i} />
                      ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Stub sections for Retention / Customers / Growth ── */}
          {(activeSection === "retention" || activeSection === "customers" || activeSection === "growth") && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                <BarChart3 size={28} className="text-indigo-400" />
              </div>
              <h2 className="font-display font-700 text-slate-800 text-xl mb-2 capitalize">{activeSection}</h2>
              <p className="text-slate-400 text-sm">This section is coming soon.</p>
            </div>
          )}

          {/* ── Overview (default) ── */}
          {(activeSection === "overview" || activeSection === "") && (<>
          {/* Hero */}
          <HeroSection summary={insights.summary} loading={loading} />

          {/* Metrics Grid */}
          <MetricsGrid summary={insights.summary} loading={loading} />

          {/* Main Grid: Insights + Merchants */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* AI Insights Panel — 1/3 width */}
            <div className="xl:col-span-1">
              <AIInsightsPanel
                insights={insights.top_alerts}
                loading={loading}
              />
            </div>

            {/* Merchant Grid — 2/3 width */}
            <div className="xl:col-span-2">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <BarChart3 size={15} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-700 text-slate-900 text-sm tracking-tight">
                        Merchant Performance
                      </h3>
                      <p className="text-xs text-slate-400">
                        {filteredMerchants.length} merchants · Click for detail
                      </p>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {categories.map((cat) => {
                      const meta = CATEGORY_META[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                            categoryFilter === cat
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat === "all" ? "All" : `${meta?.emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-52 bg-slate-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[780px] overflow-y-auto pr-1 scrollbar-hide">
                    {filteredMerchants.map((m, i) => (
                      <MerchantCard
                        key={m.merchant_id}
                        merchant={m}
                        index={i}
                        onSelect={setSelectedMerchant}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Campaign Recommendations + Revenue Leaders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Recommendations */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <Megaphone size={15} className="text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-slate-900 text-sm tracking-tight">
                      Campaign Recommendations
                    </h3>
                    <p className="text-xs text-slate-400">AI-generated · Ready to launch</p>
                  </div>
                </div>
                <button className="btn-ghost text-xs flex items-center gap-1">
                  View All
                  <ArrowUpRight size={12} />
                </button>
              </div>

              <div className="space-y-2.5">
                {loading
                  ? [1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                    ))
                  : allCampaigns.slice(0, 5).map((c, i) => (
                      <CampaignCard key={i} campaign={c} index={i} />
                    ))}
              </div>
            </div>

            {/* Revenue Leaderboard */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <TrendingUp size={15} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-slate-900 text-sm tracking-tight">
                      Revenue Leaders
                    </h3>
                    <p className="text-xs text-slate-400">Top performing merchants this month</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {loading
                  ? [1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                    ))
                  : [...merchants]
                      .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
                      .slice(0, 6)
                      .map((m, i) => {
                        const isUp = m.revenue_growth_pct >= 0;
                        const catMeta = CATEGORY_META[m.category] || {};
                        const maxRev = merchants[0]?.monthly_revenue || 1;
                        const pct = (m.monthly_revenue / [...merchants].sort((a, b) => b.monthly_revenue - a.monthly_revenue)[0].monthly_revenue) * 100;
                        return (
                          <motion.div
                            key={m.merchant_id}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group"
                          >
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-xs font-bold text-slate-400 w-4 text-right">{i + 1}</span>
                              <span className="text-base">{catMeta.emoji}</span>
                              <span className="flex-1 text-sm font-medium text-slate-700 truncate">{m.name}</span>
                              <span className="text-sm font-bold text-slate-900">
                                ₹{(m.monthly_revenue / 100000).toFixed(1)}L
                              </span>
                              <span className={`text-xs font-semibold flex items-center gap-0.5 ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                                {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                {Math.abs(m.revenue_growth_pct).toFixed(1)}%
                              </span>
                            </div>
                            <div className="ml-7 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                                className="h-full bg-indigo-400 rounded-full"
                              />
                            </div>
                          </motion.div>
                        );
                      })}
              </div>
            </div>
          </div>
          </>)}
        </main>
      </div>

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <MerchantModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </div>
  );
}
