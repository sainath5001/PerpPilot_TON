"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LineChart,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link Tonkeeper via TON AppKit. Your keys never leave your device.",
  },
  {
    id: 2,
    icon: ClipboardList,
    title: "Plan Your Trade",
    description: "Set entry, leverage, collateral, stop-loss, and take-profit on any supported asset.",
  },
  {
    id: 3,
    icon: LineChart,
    title: "Analyze Risk Live",
    description: "Health score, liquidation price, and margin buffer update instantly as you type.",
  },
  {
    id: 4,
    icon: ArrowRight,
    title: "Fund & Execute",
    description: "Top up USDT collateral via Omniston if needed, then proceed to your perp venue with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-28 lg:mt-36">
      <FadeIn>
        <SectionHeader
          badge="How It Works"
          title="Four steps from idea to informed execution"
          description="PerpPilot guides you through the full pre-trade workflow — risk first, execution second."
          align="center"
          className="mb-14"
        />
      </FadeIn>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-emerald-500/50 via-cyan-500/30 to-transparent sm:block" />

        <div className="space-y-6">
          {STEPS.map((step, index) => (
            <FadeIn key={step.id} delay={index * 100}>
              <div className="group relative flex gap-5 sm:gap-6">
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300",
                      "border-emerald-500/30 bg-emerald-500/10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/15"
                    )}
                  >
                    <step.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="mt-1 font-mono text-[10px] text-muted-foreground">
                    0{step.id}
                  </span>
                </div>

                <div className="flex-1 rounded-xl border border-border/60 bg-card/40 p-5 transition-all duration-300 group-hover:border-emerald-500/20 group-hover:bg-card/60">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TradeFlowVisualization() {
  const flow = [
    { label: "Trade Plan", sub: "Entry · Leverage · SL/TP" },
    { label: "Risk Engine", sub: "Health · Liq. Price" },
    { label: "Wallet Check", sub: "USDT Balance" },
    { label: "Omniston Swap", sub: "TON → USDT" },
    { label: "Ready", sub: "Execute on DEX" },
  ];

  return (
    <section id="trade-flow" className="mt-28 lg:mt-36">
      <FadeIn>
        <SectionHeader
          badge="Trade Flow"
          title="End-to-end collateral preparation pipeline"
          description="Visualize how PerpPilot connects risk analysis with STON.fi liquidity."
          align="center"
          className="mb-12"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-center justify-center gap-2 px-4 lg:gap-3">
            {flow.map((node, index) => (
              <div key={node.label} className="flex items-center gap-2 lg:gap-3">
                <div
                  className={cn(
                    "relative rounded-xl border px-4 py-3 text-center transition-all duration-300",
                    index === flow.length - 1
                      ? "border-emerald-500/40 bg-emerald-500/10 glow-emerald"
                      : "border-border/60 bg-card/40 hover:border-emerald-500/20"
                  )}
                >
                  {index === flow.length - 1 && (
                    <CheckCircle2 className="absolute -right-1.5 -top-1.5 h-4 w-4 text-emerald-400" />
                  )}
                  <p className="text-sm font-semibold">{node.label}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{node.sub}</p>
                </div>
                {index < flow.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
