/**
 * BizBot AI — Redesigned Landing Page
 * Premium, minimal, executive-grade. Inspired by Stripe, Linear, Mercury.
 *
 * DROP-IN REPLACEMENT for:
 *   project/bizbot-ui/src/components/LandingPage.jsx
 *
 * No new dependencies — uses existing framer-motion + lucide-react + react-router-dom.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, BarChart3, Users,
  Megaphone, BotMessageSquare, ChevronRight,
} from "lucide-react";
import Logo, { LogoMark } from "./Logo";

// ─── Fade-up animation preset ─────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Features", "Pricing", "Docs", "Blog"];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Revenue Intelligence",
    desc: "Real-time anomaly detection flags revenue drops before they compound. Know your growth trajectory, not just last month's number.",
  },
  {
    icon: Users,
    title: "Customer Retention",
    desc: "Identify at-risk VIP customers 30 days before they lapse. Automated win-back sequences that recover 55–65% of churned spend.",
  },
  {
    icon: Megaphone,
    title: "Smart Campaigns",
    desc: "AI-generated recommendations tailored to your category, customer segment, and seasonality — with expected ROI before you launch.",
  },
  {
    icon: BotMessageSquare,
    title: "Executive AI Advisor",
    desc: "A conversational intelligence layer that correlates signals, infers root causes, and delivers actionable strategy — not chatbot text.",
  },
];

const STATS = [
  { value: "₹56L+", label: "Monthly revenue tracked" },
  { value: "87%", label: "Avg retention rate" },
  { value: "3.2×", label: "Avg campaign ROI" },
  { value: "10+", label: "Merchant partners" },
];


// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', sans-serif", color: "#0f172a", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f1f5f9",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" variant="full" />
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", gap: 28 }} className="hidden md:flex">
              {NAV_LINKS.map(item => (
                <a key={item} href="#" style={{ fontSize: 14, fontWeight: 500, color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.target.style.color = "#0f172a"}
                  onMouseLeave={e => e.target.style.color = "#64748b"}
                >{item}</a>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => navigate("/login")}
                style={{ background: "none", border: "none", fontSize: 14, fontWeight: 500, color: "#475569", cursor: "pointer", padding: "8px 12px", borderRadius: 8 }}
                onMouseEnter={e => e.target.style.color = "#0f172a"}
                onMouseLeave={e => e.target.style.color = "#475569"}
              >Sign In</button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "#4f46e5", color: "#fff", border: "none", borderRadius: 10,
                  padding: "9px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#4338ca"}
                onMouseLeave={e => e.currentTarget.style.background = "#4f46e5"}
              >Get Started <ArrowRight size={13} /></button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 148, paddingBottom: 112, paddingLeft: 32, paddingRight: 32, position: "relative", textAlign: "center" }}>
        {/* Single, subtle radial glow — no blobs */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 640, height: 400,
          background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>

          {/* Status pill */}
          <motion.div {...fadeUp(0)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: "1px solid #e0e7ff", background: "#fafbff", marginBottom: 40 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#4f46e5", letterSpacing: "0.01em" }}>Now in Beta · AI-Powered Merchant Intelligence</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.08)} style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: "#0f172a",
            margin: "0 0 28px",
          }}>
            AI Executive OS
            <br />
            <span style={{ color: "#4f46e5" }}>for Local Merchants</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p {...fadeUp(0.16)} style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "#64748b",
            maxWidth: 560,
            margin: "0 auto 52px",
            fontWeight: 400,
          }}>
            Turn merchant data into decisions. The intelligence layer that enterprise brands pay millions for — at merchant scale.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.24)} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 52 }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#4f46e5", color: "#fff", border: "none", borderRadius: 12,
                padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 1px 2px rgba(79,70,229,0.2), 0 4px 16px rgba(79,70,229,0.18)",
                transition: "all 0.15s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(79,70,229,0.25), 0 6px 20px rgba(79,70,229,0.26)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#4f46e5"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(79,70,229,0.2), 0 4px 16px rgba(79,70,229,0.18)"; }}
            >
              Get Started Free <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#fff", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 12,
                padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.15s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              View Live Demo <ChevronRight size={15} />
            </button>
          </motion.div>

          {/* Trust row */}
          <motion.div {...fadeUp(0.32)} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "10px 28px" }}>
            {["No credit card required", "Setup in 5 minutes", "SOC 2 compliant", "Cancel anytime"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 450 }}>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "0 32px 88px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "44px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STATS.map(({ value, label }, i) => (
              <motion.div key={label} {...fadeUpInView(i * 0.07)} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8, fontWeight: 450 }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "0 32px 96px" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <motion.div {...fadeUpInView()} style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366f1", marginBottom: 14 }}>Platform</p>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.15, marginBottom: 16, margin: "0 0 16px" }}>
              Everything a merchant needs<br />to make smarter decisions
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              From revenue intelligence to campaign automation — surfacing what matters, when it matters.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUpInView(i * 0.08)}
                style={{
                  background: "#fff", border: "1px solid #f1f5f9", borderRadius: 16,
                  padding: "32px 32px 32px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#e0e7ff"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={18} color="#6366f1" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Bottom CTA ── */}
      <section style={{ padding: "96px 32px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <motion.div {...fadeUpInView()}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.15, marginBottom: 16 }}>
              Ready to run your business<br />with AI clarity?
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", marginBottom: 40, lineHeight: 1.7 }}>
              Join merchant operators who replaced reactive decisions with proactive AI intelligence.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "#4f46e5", color: "#fff", border: "none", borderRadius: 12,
                  padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 1px 2px rgba(79,70,229,0.2), 0 4px 16px rgba(79,70,229,0.18)",
                  transition: "all 0.15s", letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#4f46e5"; }}
              >
                Get Started Free <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "#fff", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 12,
                  padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s", letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                View Live Demo <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #f1f5f9", padding: "32px", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <Logo size="xs" variant="full" />
          <p style={{ fontSize: 12, color: "#cbd5e1" }}>© 2025 BizBot AI. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map(item => (
              <a key={item} href="#" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = "#475569"}
                onMouseLeave={e => e.target.style.color = "#94a3b8"}
              >{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
