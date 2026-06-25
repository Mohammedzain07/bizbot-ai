/**
 * BizBot AI — Executive Intelligence System
 * Redesigned AI reasoning engine with multi-signal analysis,
 * industry-specific logic, and executive-grade insight formatting.
 *
 * DROP-IN REPLACEMENT for:
 *   project/bizbot-ui/src/pages/BizBotAssistant.jsx
 *
 * Requires the Claude API key proxy already wired in the project.
 * Set VITE_API_URL in .env (existing backend) — the AI calls go to
 * the Anthropic API directly from the browser via the existing proxy.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { LogoMark } from "../components/Logo";
import MERCHANTS, { CATEGORY_META } from "../data/merchants";
import {
  ChevronDown, Send, Zap, TrendingUp, TrendingDown,
  Users, ShieldCheck, Megaphone, RotateCcw, CheckCircle2,
  AlertTriangle, XCircle, HelpCircle, Activity, Target,
  BarChart2, Flame, ArrowRight, Lightbulb, Clock,
} from "lucide-react";

// ─── Signal Engine ────────────────────────────────────────────────────────────
// Derives structured signals from raw merchant data.
// These signals are injected into the AI prompt as structured context.

function deriveSignals(m) {
  const signals = [];
  const newRatio = m.new_customers / Math.max(m.total_customers, 1);
  const vipInactivePct = (m.vip_inactive_30d / Math.max(m.vip_customers, 1)) * 100;

  // Revenue signals
  if (m.revenue_growth_pct >= 15)
    signals.push({ id: "strong_growth", label: "strong_growth_signal", severity: "positive", weight: 3 });
  else if (m.revenue_growth_pct >= 5)
    signals.push({ id: "moderate_growth", label: "moderate_growth", severity: "positive", weight: 2 });
  else if (m.revenue_growth_pct < -5)
    signals.push({ id: "revenue_decline", label: "revenue_declining", severity: "critical", weight: 5 });
  else if (m.revenue_growth_pct < 0)
    signals.push({ id: "revenue_flat", label: "revenue_softening", severity: "warning", weight: 3 });

  // Retention signals
  if (m.retention_rate >= 90)
    signals.push({ id: "high_retention", label: "elite_retention", severity: "positive", weight: 2 });
  else if (m.retention_rate < 80)
    signals.push({ id: "low_retention", label: "retention_below_benchmark", severity: "critical", weight: 4 });
  else if (m.retention_rate < 87)
    signals.push({ id: "mid_retention", label: "retention_below_benchmark", severity: "warning", weight: 2 });

  // VIP signals
  if (vipInactivePct > 25)
    signals.push({ id: "vip_critical", label: `vip_inactive_${m.vip_inactive_30d}`, severity: "critical", weight: 5 });
  else if (m.vip_inactive_30d > 5)
    signals.push({ id: "vip_warning", label: `vip_inactive_${m.vip_inactive_30d}d`, severity: "warning", weight: 3 });

  // Acquisition signals
  if (newRatio < 0.10)
    signals.push({ id: "low_acquisition", label: "low_new_acquisition", severity: "warning", weight: 3 });
  else if (newRatio > 0.20)
    signals.push({ id: "high_acquisition", label: "strong_acquisition", severity: "positive", weight: 2 });

  // Churn signals
  if (m.churn_risk_score >= 55)
    signals.push({ id: "churn_critical", label: "churn_risk_critical", severity: "critical", weight: 5 });
  else if (m.churn_risk_score >= 35)
    signals.push({ id: "churn_warning", label: "churn_risk_elevated", severity: "warning", weight: 3 });

  // Composite inferences
  const hasGrowthButPoorRetention =
    m.revenue_growth_pct > 8 && m.retention_rate < 85;
  const hasChurnAndVIPInactivity =
    m.churn_risk_score > 35 && m.vip_inactive_30d > 5;
  const hasDeclineAndPoorRetention =
    m.revenue_growth_pct < -3 && m.retention_rate < 87;

  if (hasGrowthButPoorRetention)
    signals.push({ id: "acquisition_led_growth", label: "acquisition_masking_churn", severity: "warning", weight: 4 });
  if (hasChurnAndVIPInactivity)
    signals.push({ id: "compound_churn_risk", label: "compound_churn_risk", severity: "critical", weight: 6 });
  if (hasDeclineAndPoorRetention)
    signals.push({ id: "double_pressure", label: "revenue_retention_double_pressure", severity: "critical", weight: 5 });

  // Multi-branch signal
  if (m.branches > 2 && m.churn_risk_score > 35)
    signals.push({ id: "branch_divergence", label: "multi_branch_divergence_risk", severity: "warning", weight: 3 });

  return signals.sort((a, b) => b.weight - a.weight);
}

// ─── Industry Context Builder ─────────────────────────────────────────────────
const INDUSTRY_BENCHMARKS = {
  salon: {
    retentionBenchmark: 88,
    avgTransactionBenchmark: 1800,
    newCustomerBenchmark: 0.18,
    keyMetrics: ["appointment frequency", "stylist utilization", "membership retention", "upsell rate"],
    riskIndicators: ["VIP lapse > 14 days", "avg transaction below ₹1,500", "new customer ratio below 15%"],
    growthLevers: ["package bundles", "membership programs", "referral with free treatment", "seasonal campaigns"],
  },
  restaurant: {
    retentionBenchmark: 90,
    avgTransactionBenchmark: 1400,
    newCustomerBenchmark: 0.20,
    keyMetrics: ["peak hour fill rate", "repeat diner rate", "table turn rate", "menu AOV"],
    riskIndicators: ["retention below 87%", "VIP diner lapse > 21 days", "review score below 4.5"],
    growthLevers: ["loyalty stamp program", "pre-booking incentives", "weekend fill campaigns", "occasion targeting"],
  },
  gym: {
    retentionBenchmark: 85,
    avgTransactionBenchmark: 1200,
    newCustomerBenchmark: 0.15,
    keyMetrics: ["membership churn", "attendance frequency", "trainer engagement", "renewal rate"],
    riskIndicators: ["churn score > 40", "attendance drop > 20%", "membership renewals declining"],
    growthLevers: ["30-day challenges", "trainer-led campaigns", "seasonal memberships", "referral discounts"],
  },
  supermarket: {
    retentionBenchmark: 82,
    avgTransactionBenchmark: 800,
    newCustomerBenchmark: 0.12,
    keyMetrics: ["basket size", "visit frequency", "category penetration", "loyalty card usage"],
    riskIndicators: ["basket size below ₹700", "visit frequency drop", "VIP shoppers lapsing"],
    growthLevers: ["meal-complete bundles", "loyalty tier rewards", "personalised offers", "category cross-sells"],
  },
};

// ─── Confidence Scoring ───────────────────────────────────────────────────────
function computeConfidenceScore(signals, merchant) {
  // Higher signal weight sum → more confident the AI can make specific recommendations
  const totalWeight = signals.reduce((s, sig) => s + sig.weight, 0);
  const dataQuality = [
    merchant.vip_customers > 0,
    merchant.total_customers > 50,
    merchant.monthly_revenue > 0,
    merchant.retention_rate > 0,
    merchant.churn_risk_score > 0,
  ].filter(Boolean).length;
  const base = Math.min(60 + totalWeight * 3 + dataQuality * 3, 97);
  return Math.round(base);
}

// ─── Prompt Engineering: AI Context Builder ───────────────────────────────────
function buildSystemPrompt(merchant, signals, conversationHistory) {
  const benchmarks = INDUSTRY_BENCHMARKS[merchant.category] || INDUSTRY_BENCHMARKS.salon;
  const confidence = computeConfidenceScore(signals, merchant);
  const vipInactivePct = ((merchant.vip_inactive_30d / Math.max(merchant.vip_customers, 1)) * 100).toFixed(0);
  const newRatioPct = ((merchant.new_customers / Math.max(merchant.total_customers, 1)) * 100).toFixed(1);
  const revenueChange = merchant.monthly_revenue - merchant.prev_month_revenue;
  const topSignals = signals.slice(0, 5).map(s => `- [${s.severity.toUpperCase()}] ${s.label} (weight: ${s.weight})`).join("\n");

  return `You are the BizBot AI Executive Intelligence System — an AI Chief Operating Officer for local merchants.
You are NOT a chatbot. You are a strategic business advisor who thinks like a McKinsey consultant with deep operational knowledge of the ${merchant.category} industry.

CURRENT MERCHANT CONTEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━
Merchant: ${merchant.name}
Category: ${merchant.category} (${merchant.city})
Health Status: ${merchant.health_status}
Rating: ${merchant.rating}/5.0 | Branches: ${merchant.branches} | Staff: ${merchant.staff_count}

FINANCIAL METRICS:
- Monthly Revenue: ₹${merchant.monthly_revenue.toLocaleString("en-IN")}
- Previous Month: ₹${merchant.prev_month_revenue.toLocaleString("en-IN")}
- Growth: ${merchant.revenue_growth_pct >= 0 ? "+" : ""}${merchant.revenue_growth_pct}% (₹${Math.abs(revenueChange).toLocaleString("en-IN")} ${revenueChange >= 0 ? "gain" : "decline"})
- Avg Transaction: ₹${merchant.avg_transaction_value.toFixed(0)} (industry benchmark: ₹${benchmarks.avgTransactionBenchmark})

CUSTOMER METRICS:
- Total Customers: ${merchant.total_customers}
- New Customers: ${merchant.new_customers} (${newRatioPct}% of total, benchmark: ${(benchmarks.newCustomerBenchmark * 100).toFixed(0)}%)
- Returning Customers: ${merchant.returning_customers}
- Retention Rate: ${merchant.retention_rate}% (industry benchmark: ${benchmarks.retentionBenchmark}%)
- VIP Customers: ${merchant.vip_customers} total, ${merchant.vip_inactive_30d} inactive 30d (${vipInactivePct}% VIP lapse)
- Churn Risk Score: ${merchant.churn_risk_score}/100

TOP SERVICE: ${merchant.top_service}
MARKETING BUDGET: ₹${merchant.marketing_budget.toLocaleString("en-IN")}/month

ACTIVE AI SIGNALS (ordered by severity):
${topSignals}

INDUSTRY CONTEXT (${merchant.category}):
- Key metrics to watch: ${benchmarks.keyMetrics.join(", ")}
- Risk indicators: ${benchmarks.riskIndicators.join("; ")}
- Growth levers: ${benchmarks.growthLevers.join(", ")}

COMPOSITE INFERENCES:
${signals.find(s => s.id === "acquisition_led_growth") ? "⚠ INFERRED: Revenue growth is being driven by new customer acquisition while repeat customer loyalty is weakening — a fragile growth model that will reverse if acquisition slows." : ""}
${signals.find(s => s.id === "compound_churn_risk") ? "🔴 INFERRED: VIP inactivity + elevated churn risk are compounding — high probability of accelerating customer loss within 30–45 days without intervention." : ""}
${signals.find(s => s.id === "double_pressure") ? "🔴 INFERRED: Revenue decline and poor retention are creating a double-compression effect — each lost customer reduces both current and future revenue." : ""}

CONFIDENCE LEVEL: ${confidence}% (based on signal strength and data completeness)

CONVERSATION HISTORY SUMMARY:
${conversationHistory.length > 0 ? conversationHistory.slice(-4).map(m => `${m.role}: ${m.content.substring(0, 100)}...`).join("\n") : "No prior context. This is the opening analysis."}

RESPONSE RULES:
1. NEVER give generic advice. Every insight must reference specific numbers from this merchant's data.
2. ALWAYS correlate signals — don't analyze metrics in isolation.
3. Format responses as executive intelligence, not chatbot text.
4. Use this structure when giving analysis:
   → Business Health Signal (1 sentence)
   → Root Cause Analysis (what the data suggests)
   → Recommended Action (specific, actionable, named)
   → Expected Outcome (with timeframe and estimated impact in ₹ or %)
   → Confidence Level: X%
5. When recommending campaigns, always specify: channel, segment, offer, expected ROI, timeline.
6. Be direct. Be specific. Be strategic. No filler sentences.
7. When user confirms an action ("yes", "go ahead", "launch it"), output a detailed campaign brief.
8. Identify the HIGHEST-PRIORITY issue first based on signal weights.
9. Max response length: 280 words. Concise intelligence, not essays.
10. Use ₹ for currency. Use Indian number formatting (lakhs, not millions).`;
}

// ─── Intent Classification ────────────────────────────────────────────────────
function classifyIntent(message) {
  const msg = message.toLowerCase().trim();
  if (/^(yes|yeah|yep|sure|ok|okay|go ahead|let'?s|sounds good|confirmed?|absolutely|proceed|launch|start|run it|do it)[!\s.]*$/.test(msg))
    return { key: "commit", mode: "Action Delivery", modeColor: "text-emerald-600 bg-emerald-50" };
  if (/stop|no thanks|opt.?out|not interested|cancel/.test(msg))
    return { key: "opt_out", mode: "Standby", modeColor: "text-slate-500 bg-slate-100" };
  if (/stupid|useless|scam|terrible|awful|hate|rubbish/.test(msg))
    return { key: "hostile", mode: "De-escalation", modeColor: "text-red-600 bg-red-50" };
  if (/campaign|offer|promotion|discount|whatsapp|message|outreach/.test(msg))
    return { key: "campaign", mode: "Advisory", modeColor: "text-violet-600 bg-violet-50" };
  if (/retention|loyalty|churn|inactive|leaving|lost customer/.test(msg))
    return { key: "retention", mode: "Advisory", modeColor: "text-blue-600 bg-blue-50" };
  if (/revenue|sales|growth|profit|money/.test(msg))
    return { key: "revenue", mode: "Advisory", modeColor: "text-blue-600 bg-blue-50" };
  return { key: "general", mode: "Advisory", modeColor: "text-blue-600 bg-blue-50" };
}

// ─── Anthropic API Call ───────────────────────────────────────────────────────
async function callClaudeAPI(systemPrompt, messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.content?.find(b => b.type === "text")?.text || "Unable to generate insight.";
}

// ─── Insight Card Component ───────────────────────────────────────────────────
function InsightCard({ insight }) {
  const severityConfig = {
    critical: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", label: "Critical Risk" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", label: "Watch" },
    positive: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", label: "Opportunity" },
  };
  const cfg = severityConfig[insight.severity] || severityConfig.warning;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-xl border p-3 ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{cfg.label}</span>
      </div>
      <p className="text-xs font-semibold text-slate-800 leading-snug">{insight.label.replace(/_/g, " ")}</p>
    </motion.div>
  );
}

// ─── Confidence Ring Component ────────────────────────────────────────────────
function ConfidenceRing({ score }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = score >= 85 ? "#059669" : score >= 70 ? "#d97706" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <text x="24" y="29" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{score}%</text>
      </svg>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">AI Confidence</p>
        <p className="text-xs text-slate-600">{score >= 85 ? "High certainty" : score >= 70 ? "Moderate" : "Low signal"}</p>
      </div>
    </div>
  );
}

// ─── Message Bubble Component ─────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.role === "assistant";
  const renderText = (text) =>
    text.split(/(\*\*[^*]+\*\*|\n|`[^`]+`)/g).map((chunk, i) => {
      if (chunk.startsWith("**") && chunk.endsWith("**"))
        return <strong key={i} className="font-semibold">{chunk.slice(2, -2)}</strong>;
      if (chunk.startsWith("`") && chunk.endsWith("`"))
        return <code key={i} className="bg-slate-100 text-indigo-700 px-1 rounded text-[11px] font-mono">{chunk.slice(1, -1)}</code>;
      if (chunk === "\n") return <br key={i} />;
      return chunk;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <LogoMark size={16} />
        </div>
      )}
      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isBot
          ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-card"
          : "bg-indigo-600 text-white rounded-tr-sm"
      }`}>
        {renderText(msg.content)}
        <p className={`text-[10px] mt-1.5 ${isBot ? "text-slate-400" : "text-indigo-200"}`}>{msg.time}</p>
      </div>
    </motion.div>
  );
}

// ─── Simulated Reply Buttons ──────────────────────────────────────────────────
const SIM_BUTTONS = [
  { label: "Commit (YES)", text: "Yes, go ahead!", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", icon: CheckCircle2 },
  { label: "Query (How?)", text: "How does this work exactly?", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", icon: HelpCircle },
  { label: "Opt-Out (STOP)", text: "Stop, not interested.", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", icon: AlertTriangle },
  { label: "Hostile", text: "This is completely useless.", color: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100", icon: XCircle },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BizBotAssistant() {
  const [selectedId, setSelectedId] = useState(MERCHANTS[0].merchant_id);
  const [messages, setMessages] = useState([]);
  const [apiMessages, setApiMessages] = useState([]); // full context for Claude
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState("Advisory");
  const [currentModeColor, setCurrentModeColor] = useState("text-blue-600 bg-blue-50");
  const [currentIntent, setCurrentIntent] = useState(null);
  const [rationale, setRationale] = useState("Awaiting merchant query…");
  const [confidenceScore, setConfidenceScore] = useState(72);
  const chatEndRef = useRef(null);

  const merchant = MERCHANTS.find(m => m.merchant_id === selectedId) || MERCHANTS[0];
  const catMeta = CATEGORY_META?.[merchant.category] || {};
  const signals = deriveSignals(merchant);
  const topSignals = signals.slice(0, 6);

  // Initialize conversation when merchant changes
  useEffect(() => {
    const conf = computeConfidenceScore(signals, merchant);
    setConfidenceScore(conf);
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const growth = merchant.revenue_growth_pct;
    const criticalSignal = signals.find(s => s.severity === "critical");

    const greeting = `Hello! I'm **BizBot AI**, your executive intelligence advisor.\n\nI'm analyzing **${merchant.name}** (${merchant.city}) right now.\n\n📊 **Quick Snapshot:**\n• Revenue: ₹${(merchant.monthly_revenue / 100000).toFixed(1)}L (${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% vs last month)\n• Retention: ${merchant.retention_rate}% (benchmark: ${INDUSTRY_BENCHMARKS[merchant.category]?.retentionBenchmark || 88}%)\n• VIP Inactive: ${merchant.vip_inactive_30d} customers\n• Churn Risk Score: ${merchant.churn_risk_score}/100\n\n${criticalSignal ? `⚠️ **Priority Alert:** I've detected a \`${criticalSignal.label.replace(/_/g, " ")}\` signal that needs attention.\n\n` : ""}Ask me anything — or I'll lead with the highest-priority insight for this merchant.`;

    setMessages([{ id: Date.now(), role: "assistant", content: greeting, time: now }]);
    setApiMessages([]);
    setCurrentIntent(null);
    setCurrentMode("Advisory");
    setCurrentModeColor("text-blue-600 bg-blue-50");
    setRationale(`Signal engine loaded ${signals.length} signals for ${merchant.name}. Confidence: ${conf}%.`);
  }, [selectedId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const intent = classifyIntent(trimmed);

    const userMsg = { id: Date.now(), role: "user", content: trimmed, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setCurrentIntent(intent.key);
    setCurrentMode(intent.mode);
    setCurrentModeColor(intent.modeColor);

    const newApiMessages = [...apiMessages, { role: "user", content: trimmed }];
    const systemPrompt = buildSystemPrompt(merchant, signals, newApiMessages);

    try {
      setRationale(`Processing intent: ${intent.key}. Correlating ${signals.length} signals. Generating executive insight…`);
      const responseText = await callClaudeAPI(systemPrompt, newApiMessages);
      const replyTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      const assistantApiMsg = { role: "assistant", content: responseText };
      setApiMessages([...newApiMessages, assistantApiMsg]);

      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: responseText, time: replyTime }]);
      setRationale(`${intent.key.replace(/_/g, " ")} intent resolved. Context stack: ${newApiMessages.length + 1} turns.`);
    } catch (err) {
      const errorTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "assistant",
        content: `I encountered an issue connecting to the intelligence engine. Please check your API configuration and try again.\n\nError: ${err.message}`,
        time: errorTime,
      }]);
      setRationale("API connection failed. Check ANTHROPIC_API_KEY configuration.");
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, apiMessages, merchant, signals]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <div className="flex flex-col min-h-screen" style={{ marginLeft: "var(--sidebar-width)" }}>
        <Navbar title="BizBot Assistant" subtitle="AI Executive Intelligence System" />

        <main
          className="flex-1 px-6 pb-6 grid grid-cols-1 xl:grid-cols-5 gap-5"
          style={{ paddingTop: "calc(var(--navbar-height) + 24px)" }}
        >
          {/* ── Left Panel ── */}
          <div className="xl:col-span-2 space-y-4">

            {/* Merchant Selector */}
            <div className="card p-5">
              <p className="section-label mb-2">Target Merchant</p>
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="input-field appearance-none pr-10 cursor-pointer"
                >
                  {MERCHANTS.map(m => (
                    <option key={m.merchant_id} value={m.merchant_id}>
                      {m.name} ({m.category.charAt(0).toUpperCase() + m.category.slice(1)})
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Merchant Info */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
                  {catMeta.emoji || "🏪"}
                </div>
                <div>
                  <h3 className="font-display font-700 text-slate-900 text-base tracking-tight">{merchant.name}</h3>
                  <p className="text-xs text-slate-400">
                    {merchant.category.charAt(0).toUpperCase() + merchant.category.slice(1)} · {merchant.city}
                    <span className={`ml-2 font-medium ${
                      merchant.health_status === "thriving" ? "text-emerald-600" :
                      merchant.health_status === "stable" ? "text-blue-600" :
                      merchant.health_status === "at_risk" ? "text-amber-600" : "text-red-600"
                    }`}>
                      {merchant.health_status.replace("_", " ").toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  {
                    label: "Revenue", icon: BarChart2,
                    value: `₹${(merchant.monthly_revenue / 100000).toFixed(1)}L`,
                    sub: `${merchant.revenue_growth_pct >= 0 ? "+" : ""}${merchant.revenue_growth_pct.toFixed(1)}%`,
                    subColor: merchant.revenue_growth_pct >= 0 ? "text-emerald-600" : "text-red-500",
                    subIcon: merchant.revenue_growth_pct >= 0 ? TrendingUp : TrendingDown,
                  },
                  {
                    label: "Retention", icon: ShieldCheck,
                    value: `${merchant.retention_rate}%`,
                    sub: merchant.retention_rate >= (INDUSTRY_BENCHMARKS[merchant.category]?.retentionBenchmark || 88) ? "Above benchmark" : "Below benchmark",
                    subColor: merchant.retention_rate >= (INDUSTRY_BENCHMARKS[merchant.category]?.retentionBenchmark || 88) ? "text-emerald-600" : "text-amber-600",
                    subIcon: null,
                  },
                  {
                    label: "VIP Inactive", icon: Users,
                    value: merchant.vip_inactive_30d,
                    sub: `of ${merchant.vip_customers} VIPs`,
                    subColor: merchant.vip_inactive_30d > 5 ? "text-red-500" : "text-slate-500",
                    subIcon: null,
                  },
                  {
                    label: "Churn Risk", icon: Activity,
                    value: `${merchant.churn_risk_score}`,
                    sub: merchant.churn_risk_score >= 55 ? "Critical" : merchant.churn_risk_score >= 35 ? "Elevated" : "Low",
                    subColor: merchant.churn_risk_score >= 55 ? "text-red-600" : merchant.churn_risk_score >= 35 ? "text-amber-600" : "text-emerald-600",
                    subIcon: null,
                  },
                ].map(({ label, icon: Icon, value, sub, subColor, subIcon: SubIcon }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} className="text-slate-400" />
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                    </div>
                    <p className="text-base font-bold text-slate-900 font-display">{value}</p>
                    <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${subColor}`}>
                      {SubIcon && <SubIcon size={10} />}{sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Active Signals */}
              <p className="text-xs font-semibold text-slate-500 mb-2">Active Intelligence Signals</p>
              <div className="space-y-1.5">
                {topSignals.length === 0 ? (
                  <p className="text-xs text-slate-400">No significant signals detected.</p>
                ) : (
                  topSignals.map(sig => <InsightCard key={sig.id} insight={sig} />)
                )}
              </div>
            </div>

            {/* AI State Monitor */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={15} className="text-indigo-600" />
                <h4 className="font-display font-700 text-slate-800 text-sm">AI Intelligence State</h4>
              </div>

              <div className="space-y-3">
                {/* Confidence Ring */}
                <ConfidenceRing score={confidenceScore} />

                <div className="divider" />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Reasoning Mode</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${currentModeColor}`}>
                    {currentMode}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Intent Classified</p>
                  <span className="badge-neutral text-[10px] font-mono">
                    {currentIntent || "awaiting_input"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Signal Count</p>
                  <span className="text-xs font-semibold text-slate-700">{signals.length} active</span>
                </div>

                <div className="divider" />

                <div>
                  <p className="text-xs text-slate-500 mb-2">Operational Rationale</p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rationale}"</p>
                  </div>
                </div>

                {/* Mode legend */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    { mode: "Advisory", color: "bg-blue-500" },
                    { mode: "Action Delivery", color: "bg-emerald-500" },
                    { mode: "Standby", color: "bg-slate-400" },
                    { mode: "De-escalation", color: "bg-red-500" },
                  ].map(({ mode, color }) => (
                    <div key={mode} className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} />
                      <span className="text-[10px] text-slate-500">{mode}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Chat ── */}
          <div className="xl:col-span-3 flex flex-col">
            <div className="card flex flex-col h-[calc(100vh-120px)] min-h-[600px]">

              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                      <LogoMark size={20} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">BizBot AI — Executive Intelligence</p>
                    <p className="text-xs text-emerald-600 font-medium">
                      online · {merchant.category} specialist · {signals.filter(s => s.severity === "critical").length} critical alerts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(id => { const t = id; setTimeout(() => setSelectedId(t), 5); return ""; })}
                  title="Reset conversation"
                  className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
                {messages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                        <LogoMark size={16} />
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 items-center h-4">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">analyzing signals…</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Simulate Buttons */}
              <div className="px-4 pb-3 flex-shrink-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Simulate Merchant Replies
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SIM_BUTTONS.map(({ label, text, color, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => sendMessage(text)}
                      disabled={isTyping}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 disabled:opacity-40 ${color}`}
                    >
                      <Icon size={12} />{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-4 pb-4 flex-shrink-0 border-t border-slate-100 pt-3">
                <form
                  onSubmit={e => { e.preventDefault(); sendMessage(input); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything — growth strategy, retention, campaigns…"
                    disabled={isTyping}
                    className="input-field flex-1 py-2.5 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="btn-primary px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
