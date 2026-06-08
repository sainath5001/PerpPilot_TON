"use client";

import { ChartMarketHeader } from "@/components/chart/ChartMarketHeader";
import { TradingViewChart } from "@/components/chart/TradingViewChart";
import { useChartData } from "@/hooks/use-chart-data";
import { selectSelectedAsset, useChartStore } from "@/store/chart-store";
import { cn } from "@/lib/utils";

interface TradingChartPanelProps {
  className?: string;
}

/**
 * Live ticker header + full TradingView advanced chart (indicators, drawings, toolbars).
 */
export function TradingChartPanel({ className }: TradingChartPanelProps) {
  const asset = useChartStore(selectSelectedAsset);
  const assetId = useChartStore((s) => s.selectedAssetId);
  const timeframeId = useChartStore((s) => s.selectedTimeframeId);

  const { ticker, isLoading } = useChartData(assetId, timeframeId);

  return (
    <div className={cn("flex h-full min-h-[420px] flex-col", className)}>
      <ChartMarketHeader ticker={ticker} isLoading={isLoading} />
      <div className="relative min-h-0 flex-1">
        <TradingViewChart
          key={`${asset.tradingViewSymbol}-${timeframeId}`}
          symbol={asset.tradingViewSymbol}
          interval={timeframeId}
          className="absolute inset-0 h-full"
        />
      </div>
    </div>
  );
}
