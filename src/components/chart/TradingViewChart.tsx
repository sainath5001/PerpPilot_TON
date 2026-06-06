"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChartErrorState } from "@/components/chart/ChartErrorState";
import { ChartLoadingOverlay } from "@/components/chart/ChartLoadingOverlay";
import {
  createTradingViewWidgetConfig,
  loadTradingViewEmbedScript,
} from "@/lib/chart/tradingview";
import { cn } from "@/lib/utils";
import { useChartStore } from "@/store/chart-store";
import type { ChartTimeframeId } from "@/types/chart";

export interface TradingViewChartProps {
  symbol: string;
  interval: ChartTimeframeId;
  className?: string;
  height?: number | string;
  onReady?: () => void;
  onError?: (message: string) => void;
}

export function TradingViewChart({
  symbol,
  interval,
  className,
  height = "100%",
  onReady,
  onError,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [retryKey, setRetryKey] = useState(0);
  const setLoadState = useChartStore((s) => s.setLoadState);
  const setLoadError = useChartStore((s) => s.setLoadError);
  const loadState = useChartStore((s) => s.loadState);
  const loadError = useChartStore((s) => s.loadError);

  const handleReady = useCallback(() => {
    setLoadState("ready");
    setLoadError(null);
    onReady?.();
  }, [onReady, setLoadError, setLoadState]);

  const handleError = useCallback(
    (message: string) => {
      setLoadError(message);
      onError?.(message);
    },
    [onError, setLoadError]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoadState("loading");
    setLoadError(null);

    const config = createTradingViewWidgetConfig(symbol, interval);
    const cleanup = loadTradingViewEmbedScript(
      container,
      config,
      handleReady,
      handleError
    );

    return cleanup;
  }, [
    symbol,
    interval,
    retryKey,
    handleReady,
    handleError,
    setLoadState,
    setLoadError,
  ]);

  const handleRetry = () => {
    setRetryKey((key) => key + 1);
  };

  if (loadState === "error" && loadError) {
    return <ChartErrorState message={loadError} onRetry={handleRetry} />;
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
    >
      {loadState === "loading" && <ChartLoadingOverlay />}
      <div
        ref={containerRef}
        className="tradingview-widget-container h-full w-full"
      />
    </div>
  );
}
