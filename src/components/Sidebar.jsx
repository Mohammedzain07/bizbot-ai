import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, TrendingUp, Megaphone,
  Settings, LogOut, ChevronRight, Store,
  BarChart3, ShieldCheck, BotMessageSquare,
} from "lucide-react";
import Logo from "./Logo";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/merchants", label: "Merchants", icon: Store },
  { to: "/dashboard/insights", label: "AI Insights", icon: BarChart3 },
  { to: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/dashboard/retention", label: "Retention", icon: ShieldCheck },
  { to: "/dashboard/customers", label: "Customers", icon: Users },
  { to: "/dashboard/growth", label: "Growth", icon: TrendingUp },
  {
    to: "/dashboard/assistant",
    label: "BizBot Assistant",
    icon: BotMessageSquare,
    badge: "AI",
  },
];

const BOTTOM_ITEMS = [
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full bg-white border-r border-slate-100 flex flex-col z-30"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
        <Logo size="sm" variant="full" />
        <div className="ml-auto">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
            BETA
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto sidebar-scroll">
        <p className="section-label px-3 mb-2">Platform</p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600">
                      {badge}
                    </span>
                  )}
                  {isActive && !badge && (
                    <ChevronRight size={14} className="text-indigo-400" strokeWidth={2} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-3 space-y-0.5">
        {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <Icon size={16} className="text-slate-400" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        {/* User Profile */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            SR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Siddharth R.</p>
            <p className="text-xs text-slate-400 truncate">Admin · BizBot AI</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
