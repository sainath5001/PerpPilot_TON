export const APP_CONFIG = {
  name: "PerpPilot TON",
  tagline: "Professional Perpetual Risk Terminal",
  description:
    "Analyze perpetual positions, monitor liquidation risk, and manage collateral on TON.",
} as const;

export const DASHBOARD_NAV = [
  {
    id: "terminal",
    label: "Risk Terminal",
    href: "/dashboard",
    icon: "📈",
  },
  {
    id: "collateral",
    label: "Collateral Funding",
    href: "/dashboard#funding",
    icon: "💎",
    badge: "Omniston",
  },
  {
    id: "analyzer",
    label: "Portfolio View",
    href: "/dashboard/analyzer",
    icon: "🎯",
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
