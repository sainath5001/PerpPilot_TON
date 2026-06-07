import type { ChartAssetId, ChartTimeframeId } from "@/types/chart";
import { getChartAsset } from "./assets";

const BINANCE_INTERVAL: Record<ChartTimeframeId, string> = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "60": "1h",
  "240": "4h",
  D: "1d",
  W: "1w",
};

export interface CandleBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTicker {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  quoteVolume: number;
}

function binanceSymbol(assetId: ChartAssetId): string {
  const asset = getChartAsset(assetId);
  return asset.tradingViewSymbol.split(":")[1] ?? `${asset.baseAsset}USDT`;
}

export async function fetchCandles(
  assetId: ChartAssetId,
  timeframeId: ChartTimeframeId,
  limit = 400
): Promise<CandleBar[]> {
  const symbol = binanceSymbol(assetId);
  const interval = BINANCE_INTERVAL[timeframeId];

  const url = new URL("https://api.binance.com/api/v3/klines");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to load chart data (${res.status})`);
  }

  const rows = (await res.json()) as Array<
    [number, string, string, string, string, string, ...unknown[]]
  >;

  return rows.map(([time, open, high, low, close, volume]) => ({
    time: Math.floor(time / 1000),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
  }));
}

export async function fetchMarketTicker(
  assetId: ChartAssetId
): Promise<MarketTicker> {
  const symbol = binanceSymbol(assetId);

  const url = new URL("https://api.binance.com/api/v3/ticker/24hr");
  url.searchParams.set("symbol", symbol);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to load market ticker (${res.status})`);
  }

  const data = (await res.json()) as {
    symbol: string;
    lastPrice: string;
    priceChange: string;
    priceChangePercent: string;
    highPrice: string;
    lowPrice: string;
    quoteVolume: string;
  };

  return {
    symbol: data.symbol,
    lastPrice: parseFloat(data.lastPrice),
    priceChange: parseFloat(data.priceChange),
    priceChangePercent: parseFloat(data.priceChangePercent),
    highPrice: parseFloat(data.highPrice),
    lowPrice: parseFloat(data.lowPrice),
    quoteVolume: parseFloat(data.quoteVolume),
  };
}
