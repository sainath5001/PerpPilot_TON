"use client";

import {
  ArrowRight,
  BarChart3,
  Layers,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsWalletConnected } from "@/hooks/use-is-wallet-connected";

const features = [
  {
    icon: BarChart3,
    title: "Pre-Trade Risk Analysis",
    description:
      "Model liquidation price, margin ratio, and health score before opening a perpetual position.",
  },
  {
    icon: ShieldCheck,
    title: "Liquidation Monitoring",
    description:
      "Track distance-to-liquidation and portfolio-level risk in a professional trading terminal.",
  },
  {
    icon: Layers,
    title: "Collateral Management",
    description:
      "Top up collateral via STON.fi Omniston cross-chain SDK — built for TON-native traders.",
  },
];

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authRequired = searchParams.get("auth") === "required";
  const { isConnected, isReady } = useIsWalletConnected();

  useEffect(() => {
    if (isReady && isConnected) {
      router.replace("/dashboard");
    }
  }, [isConnected, isReady, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 lg:px-6 lg:pt-20">
        {authRequired && (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Connect your TON wallet to access the dashboard.
          </div>
        )}

        <section className="text-center">
          <Badge variant="success" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            STON.fi Vibe Coding Hackathon
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Professional Perpetual{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Risk Terminal
            </span>{" "}
            for TON
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            PerpPilot TON helps traders evaluate perpetual positions before
            execution. Analyze liquidation metrics, plan collateral, and trade
            with confidence — not on an exchange, but with institutional-grade
            risk tooling.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WalletConnectButton size="lg" />
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">
                Explore Features
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Wallet connection required · Tonkeeper supported · TON AppKit powered
          </p>
        </section>

        <section id="features" className="mt-24 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/80 bg-card/40 backdrop-blur transition-colors hover:border-emerald-500/30"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <feature.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="mt-16">
          <Card className="overflow-hidden border-border/80 bg-card/60">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Core Flow
                </Badge>
                <h2 className="text-2xl font-bold">Built for TON traders</h2>
                <p className="mt-3 text-muted-foreground">
                  Connect your wallet, access the dashboard, and analyze
                  perpetual positions with liquidation metrics and health scores.
                  Collateral management via Omniston arrives in the next sprint.
                </p>
                <ol className="mt-6 space-y-3 text-sm">
                  {[
                    "Connect TON wallet via AppKit",
                    "Access protected risk dashboard",
                    "Analyze position risk metrics",
                    "Manage collateral via Omniston (soon)",
                  ].map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl border border-border bg-background/80 p-6">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  Terminal Preview
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between rounded-md bg-muted/40 px-3 py-2">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className="text-emerald-400">— / 100</span>
                  </div>
                  <div className="flex justify-between rounded-md bg-muted/40 px-3 py-2">
                    <span className="text-muted-foreground">
                      Liquidation Distance
                    </span>
                    <span>—%</span>
                  </div>
                  <div className="flex justify-between rounded-md bg-muted/40 px-3 py-2">
                    <span className="text-muted-foreground">Margin Ratio</span>
                    <span>—%</span>
                  </div>
                  <div className="flex justify-between rounded-md bg-muted/40 px-3 py-2">
                    <span className="text-muted-foreground">Collateral</span>
                    <span>— TON</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LandingContent />
    </Suspense>
  );
}
