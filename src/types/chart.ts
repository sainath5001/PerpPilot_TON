export type ChartAssetId = "BTCUSD" | "ETHUSD" | "TONUSD" | "SOLUSD";

export type ChartTimeframeId =
  | "1"
  | "5"
  | "15"
  | "60"
  | "240"
  | "D"
  | "W";

export type ChartLoadState = "idle" | "loading" | "ready" | "error";

export interface ChartAsset {
  id: ChartAssetId;
  label: string;
  shortLabel: string;
  baseAsset: string;
  quoteAsset: string;
  tradingViewSymbol: string;
  iconColor: string;
}

export interface ChartTimeframe {
  id: ChartTimeframeId;
  label: string;
  shortLabel: string;
}

export interface ChartWidgetConfig {
  symbol: string;
  interval: ChartTimeframeId;
  theme: "dark" | "light";
  backgroundColor: string;
  gridColor: string;
}

export interface ChartStoreState {
  selectedAssetId: ChartAssetId;
  selectedTimeframeId: ChartTimeframeId;
  loadState: ChartLoadState;
  loadError: string | null;
  isFullscreen: boolean;
  setAsset: (assetId: ChartAssetId) => void;
  setTimeframe: (timeframeId: ChartTimeframeId) => void;
  setLoadState: (state: ChartLoadState) => void;
  setLoadError: (error: string | null) => void;
  setFullscreen: (value: boolean) => void;
}
