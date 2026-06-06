"use client";

import {
  ArrowRightLeft,
  BarChart3,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
}

const FEATURES: Feature[] = [
  {
    icon: BarChart3,
    title: "Live Risk Engine",
    description:
      "Real-time liquidation price, margin buffer, and health score as you edit your trade plan — no submit button required.",
    highlight: "GMX-inspired model",
  },
  {
    icon: ShieldCheck,
    title: "Liquidation Intelligence",
    description:
      "Distance-to-liquidation, maintenance margin, and R:R ratios displayed in a professional terminal layout.",
    highlight: "26 unit-tested formulas",
  },
  {
    icon: ArrowRightLeft,
    title: "Omniston Collateral Funding",
    description:
      "Detect collateral shortfalls and acquire USDT via STON.fi Omniston — best route, fees, and price impact included.",
    highlight: "Official SDK",
  },
  {
    icon: Layers,
    title: "TradingView Charts",
    description:
      "BTC, ETH, TON, and SOL with multi-timeframe analysis in a 70/30 terminal layout built for serious traders.",
    highlight: "Live market data",
  },
  {
    icon: Zap,
    title: "Wallet-Native UX",
    description:
      "TON AppKit + TonConnect integration. Connect once, access a protected dashboard with zero custody.",
    highlight: "Tonkeeper ready",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mt-28 lg:mt-36">
      <FadeIn>
        <SectionHeader
          badge="Features"
          title="Everything a TON perp trader needs before execution"
          description="PerpPilot sits upstream of the exchange — helping you decide if a trade is worth taking."
          align="center"
          className="mb-12"
        />
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <FadeIn key={feature.title} delay={index * 80}>
            <Card
              className={cn(
                "group h-full border-border/60 bg-card/40 transition-all duration-300",
                "hover:border-emerald-500/30 hover:bg-card/60 hover:shadow-lg hover:shadow-emerald-500/5"
              )}
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/15">
                    <feature.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  {feature.highlight && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {feature.highlight}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
