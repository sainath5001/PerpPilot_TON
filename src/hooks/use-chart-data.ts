"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchCandles,
  fetchMarketTicker,
  type CandleBar,
  type MarketTicker,
} from "@/lib/chart/binance";
import type { ChartAssetId, ChartTimeframeId } from "@/types/chart";

export function useChartData(assetId: ChartAssetId, timeframeId: ChartTimeframeId) {
  const [candles, setCandles] = useState<CandleBar[]>([]);
  const [ticker, setTicker] = useState<MarketTicker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [candleData, tickerData] = await Promise.all([
        fetchCandles(assetId, timeframeId),
        fetchMarketTicker(assetId),
      ]);
      setCandles(candleData);
      setTicker(tickerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chart");
      setCandles([]);
      setTicker(null);
    } finally {
      setIsLoading(false);
    }
  }, [assetId, timeframeId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchMarketTicker(assetId)
        .then(setTicker)
        .catch(() => undefined);
    }, 10_000);
    return () => window.clearInterval(interval);
  }, [assetId]);

  return { candles, ticker, isLoading, error, reload: load };
}
