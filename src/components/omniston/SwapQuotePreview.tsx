"use client";

import { AlertTriangle, ArrowDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParsedQuoteMetrics } from "@/lib/omniston/quote-parser";
import type { OmnistonAssetMeta } from "@/lib/omniston/assets";
import { formatBaseAmount, formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SwapQuotePreviewProps {
  inputAsset: OmnistonAssetMeta;
  outputAsset: OmnistonAssetMeta;
  metrics: ParsedQuoteMetrics | null;
  isLoading?: boolean;
  isNoQuote?: boolean;
  error?: string | null;
  className?: string;
}

function AssetBadge({ asset }: { asset: OmnistonAssetMeta }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: asset.iconColor }}
      >
        {asset.symbol.slice(0, 1)}
      </span>
      <div>
        <p className="text-sm font-semibold">{asset.symbol}</p>
        <p className="text-[10px] text-muted-foreground">{asset.name}</p>
      </div>
    </div>
  );
}

export function SwapQuotePreview({
  inputAsset,
  outputAsset,
  metrics,
  isLoading,
  isNoQuote,
  error,
  className,
}: SwapQuotePreviewProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4 rounded-xl border border-border bg-card/40 p-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching best route from Omniston…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("rounded-xl border border-red-500/30 bg-red-500/5 p-4", className)}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-400">Quote unavailable</p>
            <p className="mt-1 text-xs text-red-400/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isNoQuote) {
    return (
      <div className={cn("rounded-xl border border-amber-500/30 bg-amber-500/5 p-4", className)}>
        <p className="text-sm text-amber-400">
          No liquidity route found for this swap. Try a smaller amount or different input asset.
        </p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border p-6 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          Enter collateral requirements to preview an Omniston swap quote.
        </p>
      </div>
    );
  }

  const impactVariant =
    metrics.priceImpactPercent > 2
      ? "danger"
      : metrics.priceImpactPercent > 1
        ? "warning"
        : "success";

  return (
    <div className={cn("space-y-4 rounded-xl border border-border bg-card/40 p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Swap Preview
        </p>
        <Badge variant="outline" className="font-mono text-[10px]">
          {metrics.resolverName}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3">
          <AssetBadge asset={inputAsset} />
          <p className="font-mono text-lg font-semibold tabular-nums">
            {formatBaseAmount(metrics.inputAmount, inputAsset.symbol)}
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <AssetBadge asset={outputAsset} />
          <p className="font-mono text-lg font-semibold tabular-nums text-emerald-400">
            {formatBaseAmount(metrics.outputAmount, outputAsset.symbol)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <MetricRow label="Expected Output" value={formatUsd(metrics.outputAmount)} />
        <MetricRow label="Minimum Received" value={formatUsd(metrics.minReceived)} />
        <MetricRow
          label="Price Impact"
          value={formatPercent(metrics.priceImpactPercent)}
          variant={impactVariant}
        />
        <MetricRow label="Slippage Tolerance" value={formatPercent(metrics.slippagePercent)} />
        <MetricRow label="Protocol Fee" value={formatUsd(metrics.protocolFee)} />
        <MetricRow label="Total Fees" value={formatUsd(metrics.totalFees)} />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
        <Badge variant="secondary" className="text-[10px]">
          {metrics.routeCount} route{metrics.routeCount !== 1 ? "s" : ""}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {metrics.stepCount} step{metrics.stepCount !== 1 ? "s" : ""}
        </Badge>
        {metrics.protocols.map((protocol) => (
          <Badge key={protocol} variant="outline" className="text-[10px] uppercase">
            {protocol}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-md bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-mono text-sm font-medium tabular-nums",
          variant === "success" && "text-emerald-400",
          variant === "warning" && "text-amber-400",
          variant === "danger" && "text-red-400"
        )}
      >
        {value}
      </p>
    </div>
  );
}
