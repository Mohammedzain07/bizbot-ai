/**
 * BizBot AI — API Service Layer
 * Centralized Axios client for all backend communication.
 * Falls back to local data if backend is unavailable.
 */

import axios from "axios";
import MERCHANTS, { getPlatformSummary } from "../data/merchants";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("[BizBot API] Request failed, using local fallback data:", error.message);
    return Promise.reject(error);
  }
);

// ─── AI Insight Generator (client-side fallback) ────────────────────────────

function generateInsights(merchant) {
  const insights = [];
  const { name, category, vip_inactive_30d, vip_customers, revenue_growth_pct,
          monthly_revenue, prev_month_revenue, total_customers, new_customers,
          avg_transaction_value, churn_risk_score, retention_rate, branches } = merchant;

  if (vip_inactive_30d > 5) {
    const pct = ((vip_inactive_30d / vip_customers) * 100).toFixed(1);
    const atRisk = Math.round(vip_inactive_30d * avg_transaction_value * 1.4);
    insights.push({
      type: "retention_alert", severity: "high",
      title: `${vip_inactive_30d} VIP Customers Inactive`,
      body: `${pct}% of your VIP segment hasn't visited in 30+ days. Revenue at risk: ₹${atRisk.toLocaleString("en-IN")}.`,
      action: "Launch a personalized win-back campaign with an exclusive loyalty reward.",
      impact: `Recovering 60% could generate ₹${Math.round(atRisk * 0.6).toLocaleString("en-IN")} this month.`,
      icon: "users",
    });
  }

  if (revenue_growth_pct < -5) {
    const drop = Math.abs(monthly_revenue - prev_month_revenue);
    insights.push({
      type: "revenue_alert", severity: "high",
      title: `Revenue Down ${Math.abs(revenue_growth_pct).toFixed(1)}% vs Last Month`,
      body: `${name} saw a ₹${drop.toLocaleString("en-IN")} revenue decline that needs immediate attention.`,
      action: "Audit top-line drivers: pricing, foot traffic, and repeat visit frequency.",
      impact: "Arresting decline now prevents compounding losses.",
      icon: "trending-down",
    });
  }

  if (revenue_growth_pct >= 10) {
    insights.push({
      type: "growth_opportunity", severity: "low",
      title: `Strong ${revenue_growth_pct.toFixed(1)}% Revenue Growth`,
      body: `${name} is outperforming last month. Now is the time to double down.`,
      action: "Scale marketing spend and introduce a referral bonus program.",
      impact: "Accelerating momentum could push revenue past next milestone.",
      icon: "trending-up",
    });
  }

  const newRatio = new_customers / total_customers;
  if (newRatio < 0.12) {
    insights.push({
      type: "growth_opportunity", severity: "medium",
      title: "New Customer Acquisition Below Benchmark",
      body: `Only ${(newRatio * 100).toFixed(1)}% of visitors are new — benchmark is 15-20%.`,
      action: `Run a targeted social campaign with a first-visit offer.`,
      impact: `Improving new customer rate by 5% adds ~₹${Math.round(monthly_revenue * 0.04).toLocaleString("en-IN")}/month.`,
      icon: "user-plus",
    });
  }

  if (["salon", "spa"].includes(category) && avg_transaction_value < 1800) {
    insights.push({
      type: "campaign", severity: "low",
      title: "Upsell Opportunity: Package Bundles",
      body: `Average transaction ₹${Math.round(avg_transaction_value)} is below the ₹1,800 potential for ${category} clients.`,
      action: "Introduce a 'Signature Experience' bundle combining top 2-3 services at 10% discount.",
      impact: `A ₹300 basket increase yields ₹${Math.round(total_customers * 0.4 * 300).toLocaleString("en-IN")}/month.`,
      icon: "package",
    });
  }

  if (category === "restaurant" && retention_rate < 87) {
    insights.push({
      type: "campaign", severity: "medium",
      title: "Launch a Loyalty Program",
      body: `Retention at ${retention_rate}% — top restaurants retain 90%+. A loyalty loop would close this gap.`,
      action: "Deploy a digital stamp card: 5 visits unlock a complimentary dish.",
      impact: `Improving retention by 4% retains ~${Math.round(total_customers * 0.04)} customers worth ₹${Math.round(total_customers * 0.04 * avg_transaction_value).toLocaleString("en-IN")}/month.`,
      icon: "heart",
    });
  }

  if (category === "gym" && churn_risk_score > 30) {
    insights.push({
      type: "retention_alert", severity: "medium",
      title: "Member Churn Risk Elevated",
      body: `Churn risk score of ${churn_risk_score} signals members may not renew next cycle.`,
      action: "Run a '30-Day Challenge' re-engagement campaign with milestone rewards.",
      impact: "Reducing churn by 8% preserves subscription revenue each renewal period.",
      icon: "shield",
    });
  }

  if (branches > 2 && churn_risk_score > 40) {
    insights.push({
      type: "branch_alert", severity: "high",
      title: "Multi-Branch Performance Divergence",
      body: `With ${branches} branches, performance variance is increasing. One underperformer drags overall metrics.`,
      action: "Audit branch-level NPS and staff performance. Reallocate top staff to struggling locations.",
      impact: "Bringing bottom branch to average adds significant monthly revenue.",
      icon: "map-pin",
    });
  }

  return insights;
}

function generateCampaigns(merchant) {
  const { category, vip_inactive_30d, revenue_growth_pct, new_customers, total_customers } = merchant;
  const campaigns = [];

  if (vip_inactive_30d > 4) {
    campaigns.push({
      title: "VIP Win-Back Campaign",
      channel: "WhatsApp + Email",
      segment: "Inactive VIPs",
      offer: "Exclusive 20% loyalty reward valid 14 days",
      expected_roi: "3.2x",
      effort: "Low",
      priority: "High",
    });
  }

  if (revenue_growth_pct > 8) {
    campaigns.push({
      title: "Referral Acceleration Program",
      channel: "SMS + In-app",
      segment: "Active High-LTV Customers",
      offer: "Refer a friend — both get ₹500 credit",
      expected_roi: "4.1x",
      effort: "Medium",
      priority: "High",
    });
  }

  if (new_customers / Math.max(total_customers, 1) < 0.15) {
    campaigns.push({
      title: `First Visit ${category.charAt(0).toUpperCase() + category.slice(1)} Special`,
      channel: "Instagram + Google Ads",
      segment: "New Audience — 3km radius",
      offer: "15% off first visit, no minimum",
      expected_roi: "2.7x",
      effort: "Medium",
      priority: "Medium",
    });
  }

  if (["salon", "spa", "gym"].includes(category)) {
    campaigns.push({
      title: "Seasonal Package Launch",
      channel: "Email + Push Notification",
      segment: "All Active Members",
      offer: "Bundle 3 sessions — save 18%",
      expected_roi: "2.4x",
      effort: "Low",
      priority: "Medium",
    });
  }

  if (category === "restaurant") {
    campaigns.push({
      title: "Weekend Table Pre-Fill",
      channel: "WhatsApp Broadcast",
      segment: "Past Diners (60d inactive)",
      offer: "Reserve your table — complimentary welcome drink",
      expected_roi: "3.5x",
      effort: "Low",
      priority: "High",
    });
  }

  return campaigns;
}

function enrichMerchant(m) {
  return {
    ...m,
    ai_insights: generateInsights(m),
    campaign_recommendations: generateCampaigns(m),
  };
}

// ─── API Methods ─────────────────────────────────────────────────────────────

export const api = {
  async getMerchants(category = null) {
    try {
      const url = category ? `/api/merchants?category=${category}` : "/api/merchants";
      const { data } = await client.get(url);
      return data;
    } catch {
      const merchants = category
        ? MERCHANTS.filter((m) => m.category === category)
        : MERCHANTS;
      return merchants.map(enrichMerchant);
    }
  },

  async getMerchant(id) {
    try {
      const { data } = await client.get(`/api/merchants/${id}`);
      return data;
    } catch {
      const m = MERCHANTS.find((m) => m.merchant_id === id);
      return m ? enrichMerchant(m) : null;
    }
  },

  async getInsights() {
    try {
      const { data } = await client.get("/api/insights");
      return data;
    } catch {
      const summary = getPlatformSummary();
      const allInsights = MERCHANTS.flatMap((m) =>
        generateInsights(m).map((ins) => ({
          ...ins,
          merchant_name: m.name,
          merchant_id: m.merchant_id,
          category: m.category,
        }))
      ).sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.severity] || 2) - (order[b.severity] || 2);
      });

      return {
        summary,
        top_alerts: allInsights.slice(0, 8),
        all_insights: allInsights,
      };
    }
  },

  async getRecommendations(merchantId = null) {
    try {
      const url = merchantId
        ? `/api/recommendations/${merchantId}`
        : "/api/recommendations";
      const { data } = await client.get(url);
      return data;
    } catch {
      if (merchantId) {
        const m = MERCHANTS.find((m) => m.merchant_id === merchantId);
        if (!m) return null;
        return { ...m, campaigns: generateCampaigns(m), insights: generateInsights(m) };
      }
      return MERCHANTS.map((m) => ({
        merchant_id: m.merchant_id,
        name: m.name,
        category: m.category,
        campaigns: generateCampaigns(m),
        health_status: m.health_status,
      }));
    }
  },
};

export default api;
