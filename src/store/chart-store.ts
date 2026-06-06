import { create } from "zustand";
import { getChartAsset } from "@/lib/chart/assets";
import { DEFAULT_TIMEFRAME_ID } from "@/lib/chart/timeframes";
import type { ChartStoreState } from "@/types/chart";

export const useChartStore = create<ChartStoreState>((set) => ({
  selectedAssetId: "BTCUSD",
  selectedTimeframeId: DEFAULT_TIMEFRAME_ID,
  loadState: "idle",
  loadError: null,
  isFullscreen: false,
  setAsset: (assetId) =>
    set({
      selectedAssetId: assetId,
      loadState: "loading",
      loadError: null,
    }),
  setTimeframe: (timeframeId) =>
    set({
      selectedTimeframeId: timeframeId,
      loadState: "loading",
      loadError: null,
    }),
  setLoadState: (loadState) => set({ loadState }),
  setLoadError: (loadError) =>
    set({
      loadError,
      loadState: loadError ? "error" : "ready",
    }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
}));

export const selectSelectedAsset = (state: ChartStoreState) =>
  getChartAsset(state.selectedAssetId);

export const selectTradingViewSymbol = (state: ChartStoreState) =>
  getChartAsset(state.selectedAssetId).tradingViewSymbol;
