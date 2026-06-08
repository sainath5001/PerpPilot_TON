"use client";

import {
  ArrowRightLeft,
  BarChart3,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { RadialOrbitalTimeline } from "@/components/ui/radial-orbital-timeline";
import type { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/ui/section-header";

const PLATFORM_FLOW: TimelineItem[] = [
  {
    id: 1,
    title: "Connect Wallet",
    date: "Step 1",
    content:
      "Link OKX, Tonkeeper, or any TonConnect wallet. Non-custodial — your keys never leave your device.",
    category: "Wallet",
    icon: Wallet,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Live Charts",
    date: "Step 2",
    content:
      "Analyze BTC, ETH, TON, and SOL with pro candlestick charts, volume, and multi-timeframe data from live markets.",
    category: "Market",
    icon: BarChart3,
    relatedIds: [1, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Risk Engine",
    date: "Step 3",
    content:
      "Real-time liquidation price, margin buffer, health score, and R:R ratios — 26 unit-tested formulas as you edit your plan.",
    category: "Risk",
    icon: ShieldCheck,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 88,
  },
  {
    id: 4,
    title: "Omniston Funding",
    date: "Step 4",
    content:
      "Detect collateral shortfalls and acquire USDT via STON.fi Omniston with best route, fees, and price impact preview.",
    category: "Funding",
    icon: ArrowRightLeft,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 5,
    title: "Execute Trade",
    date: "Step 5",
    content:
      "Take your fully risk-scored plan to your preferred perp venue. PerpPilot prepares — you execute with confidence.",
    category: "Execution",
    icon: Zap,
    relatedIds: [4],
    status: "pending",
    energy: 40,
  },
];

export function PlatformFlowSection() {
  return (
    <section id="platform-flow" className="mt-28 lg:mt-36">
      <FadeIn>
        <SectionHeader
          badge="Platform Flow"
          title="Your perpetual trading pipeline — visualized"
          description="Click any node to explore how PerpPilot guides you from wallet connect to execution-ready trades."
          align="center"
          className="mb-8"
        />
      </FadeIn>

      <FadeIn delay={120}>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/20 shadow-lg shadow-emerald-500/5">
          <RadialOrbitalTimeline timelineData={PLATFORM_FLOW} />
          <p className="border-t border-border/60 bg-card/40 px-4 py-3 text-center text-xs text-muted-foreground">
            Click a node to expand · Connected steps pulse when active
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
