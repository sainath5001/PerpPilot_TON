export const APP_CONFIG = {
  name: "PerpPilot TON",
  tagline: "Professional Perpetual Risk Terminal",
  description:
    "Analyze perpetual positions, monitor liquidation risk, and manage collateral on TON.",
} as const;

export const DASHBOARD_NAV = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: "📊" },
  {
    id: "analyzer",
    label: "Position Analyzer",
    href: "/dashboard/analyzer",
    icon: "🎯",
    disabled: true,
    badge: "Soon",
  },
  {
    id: "collateral",
    label: "Collateral",
    href: "/dashboard/collateral",
    icon: "💎",
    disabled: true,
    badge: "Soon",
  },
  {
    id: "history",
    label: "Trade History",
    href: "/dashboard/history",
    icon: "📜",
    disabled: true,
    badge: "Soon",
  },
] as const;
