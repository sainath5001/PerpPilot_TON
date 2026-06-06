"use client";

import { ExternalLink, Route, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/ui/section-header";

const OMNISTON_FEATURES = [
  {
    icon: Route,
    title: "Best Route RFQ",
    description: "Real-time quotes via Omniston WebSocket with protocol-level route breakdown.",
  },
  {
    icon: Shield,
    title: "Slippage Protection",
    description: "Minimum received amounts and configurable slippage tolerance on every swap.",
  },
  {
    icon: Zap,
    title: "One-Click Execution",
    description: "Build, sign, and track swaps through TonConnect — fully non-custodial.",
  },
];

export function OmnistonShowcase() {
  return (
    <section id="omniston" className="mt-28 lg:mt-36">
      <FadeIn>
        <Card className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] via-card/40 to-cyan-500/[0.04]">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">STON.fi Integration</Badge>
              <Badge variant="outline" className="font-mono text-[10px]">
                @ston-fi/omniston-sdk v0.8.1
              </Badge>
            </div>
            <SectionHeader
              title="Powered by STON.fi Omniston"
              description="PerpPilot uses the official Omniston SDK for collateral acquisition — not a mock, not a wrapper. Real RFQ, real routes, real swaps on TON mainnet."
              className="mt-4"
            />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {OMNISTON_FEATURES.map((feature, index) => (
                <FadeIn key={feature.title} delay={index * 80}>
                  <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                    <feature.icon className="mb-3 h-5 w-5 text-cyan-400" />
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-background/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-mono text-xs text-muted-foreground">
                <span className="text-emerald-400">wss://omni-ws.ston.fi</span>
                <span className="mx-2">·</span>
                TON → USDT · Swap-only settlement
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://docs.ston.fi/docs/developer-section/omniston"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Omniston Docs
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  );
}
