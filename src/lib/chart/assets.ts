import type { ChartAsset, ChartAssetId } from "@/types/chart";

export const CHART_ASSETS: Record<ChartAssetId, ChartAsset> = {
  BTCUSD: {
    id: "BTCUSD",
    label: "Bitcoin / USD",
    shortLabel: "BTC",
    baseAsset: "BTC",
    quoteAsset: "USD",
    tradingViewSymbol: "BINANCE:BTCUSDT",
    iconColor: "#f7931a",
  },
  ETHUSD: {
    id: "ETHUSD",
    label: "Ethereum / USD",
    shortLabel: "ETH",
    baseAsset: "ETH",
    quoteAsset: "USD",
    tradingViewSymbol: "BINANCE:ETHUSDT",
    iconColor: "#627eea",
  },
  TONUSD: {
    id: "TONUSD",
    label: "Toncoin / USD",
    shortLabel: "TON",
    baseAsset: "TON",
    quoteAsset: "USD",
    tradingViewSymbol: "BINANCE:TONUSDT",
    iconColor: "#0098ea",
  },
  SOLUSD: {
    id: "SOLUSD",
    label: "Solana / USD",
    shortLabel: "SOL",
    baseAsset: "SOL",
    quoteAsset: "USD",
    tradingViewSymbol: "BINANCE:SOLUSDT",
    iconColor: "#9945ff",
  },
};

export const CHART_ASSET_LIST = Object.values(CHART_ASSETS);

export function getChartAsset(assetId: ChartAssetId): ChartAsset {
  return CHART_ASSETS[assetId];
}
