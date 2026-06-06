import { AlertTriangle, Shield, TrendingDown } from "lucide-react";
import type { RiskMetrics } from "@/lib/risk-engine";
import { formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskCardProps {
  metrics: RiskMetrics;
  className?: string;
}

export function LiquidationRiskCard({ metrics, className }: RiskCardProps) {
  const isTight = metrics.distanceToLiquidation < 5;
  const isCritical = metrics.isLiquidatable || metrics.distanceToLiquidation < 2;

  return (
    <Card
      className={cn(
        "border-border/80 bg-card/60 backdrop-blur",
        isCritical && "border-red-500/30 bg-red-500/5",
        isTight && !isCritical && "border-amber-500/30 bg-amber-500/5",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Liquidation Risk
          </CardTitle>
          <TrendingDown
            className={cn(
              "h-4 w-4",
              isCritical ? "text-red-400" : isTight ? "text-amber-400" : "text-muted-foreground"
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Est. Liquidation Price</p>
          <p className="font-mono text-lg font-bold text-foreground">
            {formatUsd(metrics.estimatedLiquidationPrice)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Distance</p>
            <p
              className={cn(
                "font-mono font-semibold",
                isCritical ? "text-red-400" : isTight ? "text-amber-400" : "text-emerald-400"
              )}
            >
              {formatPercent(metrics.distanceToLiquidation)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margin Buffer</p>
            <p className="font-mono font-semibold">
              {formatPercent(metrics.marginBufferPercentage)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MarginRiskCard({ metrics, className }: RiskCardProps) {
  return (
    <Card className={cn("border-border/80 bg-card/60 backdrop-blur", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Margin Profile
          </CardTitle>
          <Shield className="h-4 w-4 text-cyan-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Maintenance</p>
            <p className="font-mono font-semibold">
              {formatUsd(metrics.maintenanceMargin)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Utilization</p>
            <p className="font-mono font-semibold">
              {formatPercent(metrics.marginUtilization)}
            </p>
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Maint. Rate</span>
            <span className="font-mono">
              {formatPercent(metrics.maintenanceMarginRate * 100, 2)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-cyan-500/80 transition-all"
              style={{
                width: `${Math.min(100, metrics.marginUtilization)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskWarningsCard({ metrics, className }: RiskCardProps) {
  if (metrics.warnings.length === 0) return null;

  return (
    <Card
      className={cn(
        "border-amber-500/20 bg-amber-500/5 backdrop-blur xl:col-span-2",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-amber-400">
            Risk Alerts
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {metrics.warnings.map((warning) => (
            <li key={warning} className="text-xs leading-relaxed text-muted-foreground">
              {warning}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
