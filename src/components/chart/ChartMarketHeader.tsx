"use client";

import { cn } from "@/lib/utils";
import type { MarketTicker } from "@/lib/chart/binance";
import { selectSelectedAsset, useChartStore } from "@/store/chart-store";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartMarketHeaderProps {
  ticker: MarketTicker | null;
  isLoading?: boolean;
  className?: string;
}

function formatPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function ChartMarketHeader({
  ticker,
  isLoading,
  className,
}: ChartMarketHeaderProps) {
  const asset = useChartStore(selectSelectedAsset);
  const isPositive = (ticker?.priceChangePercent ?? 0) >= 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 border-b border-border/60 bg-[#0a0e13] px-4 py-3",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: asset.iconColor }}
          />
          <span className="text-sm font-semibold text-muted-foreground">
            {asset.shortLabel}-PERP
          </span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-emerald-400">
            Index
          </span>
        </div>

        {isLoading || !ticker ? (
          <Skeleton className="mt-2 h-9 w-40" />
        ) : (
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-3xl font-bold tabular-nums tracking-tight">
              ${formatPrice(ticker.lastPrice)}
            </span>
            <span
              className={cn(
                "font-mono text-sm font-semibold tabular-nums",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {isPositive ? "+" : ""}
              {ticker.priceChangePercent.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
        <Stat label="24h High" value={ticker ? `$${formatPrice(ticker.highPrice)}` : "—"} />
        <Stat label="24h Low" value={ticker ? `$${formatPrice(ticker.lowPrice)}` : "—"} />
        <Stat
          label="24h Change"
          value={
            ticker
              ? `${ticker.priceChange >= 0 ? "+" : ""}${formatPrice(ticker.priceChange)}`
              : "—"
          }
          valueClass={isPositive ? "text-emerald-400" : "text-red-400"}
        />
        <Stat
          label="24h Volume"
          value={ticker ? formatVolume(ticker.quoteVolume) : "—"}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("font-mono text-sm font-medium tabular-nums", valueClass)}>
        {value}
      </p>
    </div>
  );
}
