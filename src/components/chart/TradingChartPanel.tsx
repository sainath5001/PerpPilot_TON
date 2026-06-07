"use client";

import { useEffect } from "react";
import { ChartMarketHeader } from "@/components/chart/ChartMarketHeader";
import { ProTradingChart } from "@/components/chart/ProTradingChart";
import { useChartData } from "@/hooks/use-chart-data";
import { useChartStore } from "@/store/chart-store";
import { cn } from "@/lib/utils";

interface TradingChartPanelProps {
  className?: string;
}

/**
 * GMX / Hyperliquid-style chart panel: live ticker header + candlestick + volume.
 */
export function TradingChartPanel({ className }: TradingChartPanelProps) {
  const assetId = useChartStore((s) => s.selectedAssetId);
  const timeframeId = useChartStore((s) => s.selectedTimeframeId);

  const { candles, ticker, isLoading, error, reload } = useChartData(
    assetId,
    timeframeId
  );

  const setLoadState = useChartStore((s) => s.setLoadState);
  const setLoadError = useChartStore((s) => s.setLoadError);

  useEffect(() => {
    if (isLoading) {
      setLoadState("loading");
      return;
    }
    if (error) {
      setLoadError(error);
      return;
    }
    setLoadState("ready");
    setLoadError(null);
  }, [isLoading, error, setLoadState, setLoadError]);

  return (
    <div className={cn("flex h-full min-h-[480px] flex-col", className)}>
      <ChartMarketHeader ticker={ticker} isLoading={isLoading} />
      <div className="relative min-h-0 flex-1">
        <ProTradingChart
          candles={candles}
          isLoading={isLoading}
          error={error}
          onRetry={() => void reload()}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
