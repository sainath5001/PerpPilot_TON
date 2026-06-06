"use client";

import {
  Activity,
  Crosshair,
  Layers,
  Target,
} from "lucide-react";
import { LineChart } from "lucide-react";
import {
  HealthScoreGauge,
  HealthScoreGaugePlaceholder,
} from "@/components/risk/HealthScoreGauge";
import { PnLSummaryCards } from "@/components/risk/PnLSummaryCards";
import {
  LiquidationRiskCard,
  MarginRiskCard,
  RiskWarningsCard,
} from "@/components/risk/RiskCard";
import { TerminalMetricCard } from "@/components/risk/TerminalMetricCard";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import type { LiveRiskAnalysis } from "@/hooks/use-live-risk-analysis";
import { formatBaseAmount, formatPercent, formatUsd } from "@/lib/format";
import { getChartAsset } from "@/lib/chart/assets";
import type { ChartAssetId } from "@/types/chart";
import type { TradePlannerFormValues } from "@/lib/trade-planner/schema";
import { cn } from "@/lib/utils";

interface RiskOverviewSectionProps {
  analysis: LiveRiskAnalysis;
  values: TradePlannerFormValues;
  className?: string;
}

export function RiskOverviewSection({
  analysis,
  values,
  className,
}: RiskOverviewSectionProps) {
  const { metrics, errors, isReady } = analysis;
  const asset = getChartAsset(values.assetId as ChartAssetId);

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Risk Overview</h2>
          <p className="text-sm text-muted-foreground">
            Live metrics update as you edit the trade plan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {values.side.toUpperCase()} · {asset.shortLabel}
          </Badge>
          {metrics && (
            <Badge
              variant={
                metrics.healthScore <= 40
                  ? "danger"
                  : metrics.healthScore <= 70
                    ? "warning"
                    : "success"
              }
              className="text-[10px] uppercase"
            >
              Live
            </Badge>
          )}
        </div>
      </div>

      {!isReady && (
        <EmptyState
          icon={LineChart}
          title="Risk engine standby"
          description="Enter entry price, collateral, and leverage in the trade planner to activate live risk metrics."
          compact
        />
      )}

      {isReady && errors.length > 0 && (
        <ErrorState
          title="Invalid trade parameters"
          message={errors.join(" · ")}
        />
      )}

      {metrics && (
        <>
          <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
            <HealthScoreGauge score={metrics.healthScore} className="xl:sticky xl:top-4 xl:self-start" />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <TerminalMetricCard
                label="Position Size"
                value={formatUsd(metrics.positionSizeNotional, true)}
                subValue={formatBaseAmount(metrics.positionSizeBase, asset.baseAsset)}
                icon={Layers}
                description="Notional exposure in USD"
              />
              <TerminalMetricCard
                label="Exposure"
                value={formatUsd(metrics.effectiveExposure, true)}
                icon={Activity}
                variant="info"
                description="Effective directional notional"
              />
              <TerminalMetricCard
                label="Liquidation Price"
                value={formatUsd(metrics.estimatedLiquidationPrice)}
                icon={Crosshair}
                variant={metrics.isLiquidatable ? "danger" : "warning"}
                description={`${formatPercent(metrics.distanceToLiquidation)} from entry`}
              />
              <TerminalMetricCard
                label="Margin Buffer"
                value={formatPercent(metrics.marginBufferPercentage)}
                icon={Target}
                variant={
                  metrics.marginBufferPercentage > 90
                    ? "success"
                    : metrics.marginBufferPercentage > 70
                      ? "default"
                      : "warning"
                }
                description={`Maint. ${formatUsd(metrics.maintenanceMargin)}`}
              />
            </div>
          </div>

          <PnLSummaryCards metrics={metrics} side={values.side} />

          <div className="grid gap-3 lg:grid-cols-2">
            <LiquidationRiskCard metrics={metrics} />
            <MarginRiskCard metrics={metrics} />
            <RiskWarningsCard metrics={metrics} />
          </div>
        </>
      )}

      {isReady && !metrics && errors.length === 0 && (
        <HealthScoreGaugePlaceholder />
      )}
    </section>
  );
}
