"use client";

import { ArrowRight, Shield, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWalletStore } from "@/store/wallet-store";
import { truncateAddress } from "@/lib/utils";

export function DashboardOverview() {
  const wallet = useWalletStore((s) => s.wallet);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="success" className="mb-3">
            Wallet Connected
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Risk Terminal</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Analyze perpetual positions, monitor liquidation risk, and plan
            collateral before execution. Connected as{" "}
            <span className="font-mono text-foreground">
              {wallet ? truncateAddress(wallet.address, 6) : "—"}
            </span>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          id="health"
          label="Portfolio Health"
          value="—"
          change="Pending"
          trend="neutral"
          description="Composite risk score across open positions"
        />
        <MetricCard
          id="margin"
          label="Margin Usage"
          value="—"
          change="0%"
          trend="neutral"
          description="Collateral utilization vs. available balance"
        />
        <MetricCard
          id="liquidation"
          label="Nearest Liquidation"
          value="—"
          change="N/A"
          trend="neutral"
          description="Distance to liquidation on closest position"
        />
        <MetricCard
          id="exposure"
          label="Net Exposure"
          value="—"
          change="0 TON"
          trend="neutral"
          description="Aggregate directional exposure across markets"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 bg-card/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Position Analyzer
            </CardTitle>
            <CardDescription>
              Simulate perpetual trades and preview liquidation metrics before
              execution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
              <p className="text-sm font-medium">Analyzer coming in Prompt 2</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Entry price, leverage, collateral, and health score modeling
                will live here.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              Risk Alerts
            </CardTitle>
            <CardDescription>
              Real-time warnings for margin calls and funding spikes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-sm font-medium">No active alerts</p>
              <p className="text-xs text-muted-foreground">
                Connect positions to enable monitoring.
              </p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-400">
                Upcoming
              </p>
              <p className="mt-1 text-sm">Storm Trade integration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            Collateral Management
          </CardTitle>
          <CardDescription>
            Acquire and manage collateral through STON.fi Omniston cross-chain
            SDK.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Omniston integration will enable seamless cross-chain collateral
              top-ups directly from your dashboard.
            </p>
            <Badge variant="warning">Omniston · Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
