"use client";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import { ChartErrorState } from "@/components/chart/ChartErrorState";
import { ChartLoadingOverlay } from "@/components/chart/ChartLoadingOverlay";
import type { CandleBar } from "@/lib/chart/binance";
import { cn } from "@/lib/utils";

/** GMX / Hyperliquid-inspired terminal chart colors */
const CHART_THEME = {
  background: "#0a0e13",
  text: "#8b95a8",
  grid: "rgba(37, 43, 56, 0.55)",
  border: "#252b38",
  up: "#26ddb3",
  down: "#ef4464",
  crosshair: "rgba(120, 130, 150, 0.35)",
};

interface ProTradingChartProps {
  candles: CandleBar[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ProTradingChart({
  candles,
  isLoading,
  error,
  onRetry,
  className,
}: ProTradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: CHART_THEME.background },
        textColor: CHART_THEME.text,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: CHART_THEME.grid },
        horzLines: { color: CHART_THEME.grid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: CHART_THEME.crosshair,
          labelBackgroundColor: "#1a2030",
        },
        horzLine: {
          color: CHART_THEME.crosshair,
          labelBackgroundColor: "#1a2030",
        },
      },
      rightPriceScale: {
        borderColor: CHART_THEME.border,
        scaleMargins: { top: 0.08, bottom: 0.22 },
      },
      timeScale: {
        borderColor: CHART_THEME.border,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 8,
        barSpacing: 7,
        minBarSpacing: 3,
      },
      handleScroll: { vertTouchDrag: false },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: CHART_THEME.up,
      downColor: CHART_THEME.down,
      borderUpColor: CHART_THEME.up,
      borderDownColor: CHART_THEME.down,
      wickUpColor: CHART_THEME.up,
      wickDownColor: CHART_THEME.down,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        chart.applyOptions({ width, height });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || candles.length === 0) {
      return;
    }

    candleSeriesRef.current.setData(
      candles.map((c) => ({
        time: c.time as import("lightweight-charts").UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    );

    volumeSeriesRef.current.setData(
      candles.map((c) => ({
        time: c.time as import("lightweight-charts").UTCTimestamp,
        value: c.volume,
        color:
          c.close >= c.open
            ? "rgba(38, 221, 179, 0.45)"
            : "rgba(239, 68, 100, 0.45)",
      }))
    );

    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  if (error) {
    return (
      <ChartErrorState
        message={error}
        onRetry={onRetry ?? (() => window.location.reload())}
      />
    );
  }

  return (
    <div className={cn("relative h-full w-full min-h-[420px]", className)}>
      {isLoading && <ChartLoadingOverlay label="Loading market data…" />}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
