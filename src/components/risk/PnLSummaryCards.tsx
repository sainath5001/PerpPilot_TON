import { ArrowDownRight, ArrowUpRight, Scale } from "lucide-react";
import type { RiskMetrics } from "@/lib/risk-engine";
import { formatRatio, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PnLSummaryCardsProps {
  metrics: RiskMetrics;
  side: "long" | "short";
  className?: string;
}

export function PnLSummaryCards({ metrics, side, className }: PnLSummaryCardsProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      <PnLCard
        label="Maximum Loss"
        value={formatUsd(metrics.maximumLoss)}
        subLabel="At stop or full collateral"
        icon={ArrowDownRight}
        variant="loss"
      />
      <PnLCard
        label="Potential Profit"
        value={
          metrics.potentialProfit !== null
            ? formatUsd(metrics.potentialProfit)
            : "—"
        }
        subLabel={
          metrics.potentialProfit !== null
            ? "At take profit target"
            : "Set take profit to estimate"
        }
        icon={ArrowUpRight}
        variant="profit"
      />
      <PnLCard
        label="Risk / Reward"
        value={formatRatio(metrics.riskRewardRatio)}
        subLabel={`${side.toUpperCase()} · ${metrics.asset}`}
        icon={Scale}
        variant="neutral"
      />
    </div>
  );
}

function PnLCard({
  label,
  value,
  subLabel,
  icon: Icon,
  variant,
}: {
  label: string;
  value: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "loss" | "profit" | "neutral";
}) {
  const styles = {
    loss: {
      border: "border-red-500/25",
      bg: "bg-red-500/5",
      icon: "text-red-400",
      value: "text-red-400",
    },
    profit: {
      border: "border-emerald-500/25",
      bg: "bg-emerald-500/5",
      icon: "text-emerald-400",
      value: "text-emerald-400",
    },
    neutral: {
      border: "border-border/80",
      bg: "bg-card/60",
      icon: "text-muted-foreground",
      value: "text-foreground",
    },
  }[variant];

  return (
    <Card className={cn("backdrop-blur", styles.border, styles.bg)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={cn("h-4 w-4", styles.icon)} />
      </CardHeader>
      <CardContent>
        <p className={cn("font-mono text-2xl font-bold", styles.value)}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subLabel}</p>
      </CardContent>
    </Card>
  );
}
