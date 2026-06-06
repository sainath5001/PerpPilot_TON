"use client";

import type { RiskMetrics } from "@/lib/risk-engine";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/trading";

interface RiskPreviewProps {
  metrics: RiskMetrics | null;
  error: string | null;
  isAnalyzing: boolean;
}

export function RiskPreview({ metrics, error, isAnalyzing }: RiskPreviewProps) {
  if (isAnalyzing) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/10 p-4">
        <p className="text-sm text-muted-foreground">Analyzing position...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-red-400">Analysis failed</p>
        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Risk Preview
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter trade parameters and click Analyze Position to compute risk
          metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Risk Analysis
        </p>
        <RiskLevelBadge level={metrics.riskLevel} />
      </div>

      <HealthScoreBar score={metrics.healthScore} />

      <div className="space-y-2 text-sm">
        <MetricRow
          label="Position Size"
          value={`$${formatNum(metrics.positionSizeNotional)}`}
        />
        <MetricRow
          label="Exposure"
          value={`$${formatNum(metrics.effectiveExposure)}`}
        />
        <MetricRow
          label="Liq. Price"
          value={`$${formatNum(metrics.estimatedLiquidationPrice)}`}
          highlight={
            metrics.isLiquidatable ? "danger" : undefined
          }
        />
        <MetricRow
          label="Dist. to Liq."
          value={`${formatNum(metrics.distanceToLiquidation)}%`}
        />
        <MetricRow
          label="Margin Util."
          value={`${formatNum(metrics.marginUtilization)}%`}
        />
        <MetricRow
          label="Margin Buffer"
          value={`${formatNum(metrics.marginBufferPercentage)}%`}
        />
        <MetricRow
          label="Maint. Margin"
          value={`$${formatNum(metrics.maintenanceMargin)}`}
        />
        <MetricRow
          label="Max Loss"
          value={`$${formatNum(metrics.maximumLoss)}`}
          highlight="danger"
        />
        <MetricRow
          label="Potential Profit"
          value={
            metrics.potentialProfit !== null
              ? `$${formatNum(metrics.potentialProfit)}`
              : "—"
          }
          highlight="success"
        />
        <MetricRow
          label="Risk / Reward"
          value={
            metrics.riskRewardRatio !== null
              ? `${formatNum(metrics.riskRewardRatio)} : 1`
              : "—"
          }
        />
      </div>

      {metrics.warnings.length > 0 && (
        <div className="space-y-1.5 border-t border-border pt-3">
          {metrics.warnings.map((warning) => (
            <p key={warning} className="text-xs text-amber-400/90">
              ⚠ {warning}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function HealthScoreBar({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : score >= 25
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Health Score</span>
        <span className="font-mono text-sm font-bold">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const variant =
    level === "low"
      ? "success"
      : level === "medium"
        ? "warning"
        : level === "high"
          ? "warning"
          : "danger";

  return (
    <Badge variant={variant} className="text-[10px] uppercase">
      {level} risk
    </Badge>
  );
}

function MetricRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "success" | "danger";
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono font-medium",
          highlight === "success" && "text-emerald-400",
          highlight === "danger" && "text-red-400"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
