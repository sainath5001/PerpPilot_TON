"use client";

import { useEffect, useState } from "react";
import { Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEMO_METRICS = [
  { label: "Health Score", value: 78, suffix: "/ 100", color: "text-emerald-400" },
  { label: "Liquidation Distance", value: 12.4, suffix: "%", color: "text-amber-400" },
  { label: "Margin Buffer", value: 84.2, suffix: "%", color: "text-emerald-400" },
  { label: "Position Size", value: 12500, suffix: " USD", prefix: "$", color: "text-foreground" },
];

export function TerminalPreview() {
  const [activeMetric, setActiveMetric] = useState(0);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % DEMO_METRICS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = DEMO_METRICS[0].value;
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setHealthScore(target);
        clearInterval(timer);
      } else {
        setHealthScore(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 blur-2xl" />

      <div className="glass-card glow-emerald relative overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground">
            perppilot.app/dashboard
          </span>
          <Badge variant="success" className="ml-auto text-[10px]">
            Live Demo
          </Badge>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
          <div className="border-b border-border/40 p-4 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">BTC/USD</span>
                <Badge variant="outline" className="text-[10px]">10x Long</Badge>
              </div>
              <span className="font-mono text-sm text-emerald-400">$67,842.50</span>
            </div>

            <div className="relative h-36 overflow-hidden rounded-lg bg-muted/20">
              <svg
                viewBox="0 0 400 120"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q50,70 100,75 T200,55 T300,45 T400,35 L400,120 L0,120 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0,80 Q50,70 100,75 T200,55 T300,45 T400,35"
                  fill="none"
                  stroke="rgb(16,185,129)"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                TradingView
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Risk Engine
              </span>
            </div>

            <div className="mb-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Health Score
              </p>
              <p className="font-mono text-4xl font-bold tabular-nums text-emerald-400">
                {healthScore}
              </p>
            </div>

            <div className="space-y-2">
              {DEMO_METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 font-mono text-xs transition-all duration-500",
                    i === activeMetric
                      ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                      : "bg-muted/30"
                  )}
                >
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className={cn("font-semibold tabular-nums", m.color)}>
                    {m.prefix ?? ""}
                    {i === 0 ? healthScore : m.value}
                    {m.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
