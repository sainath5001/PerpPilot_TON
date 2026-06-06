import type { ChartTimeframe, ChartTimeframeId } from "@/types/chart";

export const CHART_TIMEFRAMES: Record<ChartTimeframeId, ChartTimeframe> = {
  "1": { id: "1", label: "1 Minute", shortLabel: "1m" },
  "5": { id: "5", label: "5 Minutes", shortLabel: "5m" },
  "15": { id: "15", label: "15 Minutes", shortLabel: "15m" },
  "60": { id: "60", label: "1 Hour", shortLabel: "1H" },
  "240": { id: "240", label: "4 Hours", shortLabel: "4H" },
  D: { id: "D", label: "1 Day", shortLabel: "1D" },
  W: { id: "W", label: "1 Week", shortLabel: "1W" },
};

export const CHART_TIMEFRAME_LIST = Object.values(CHART_TIMEFRAMES);

export const DEFAULT_TIMEFRAME_ID: ChartTimeframeId = "60";

export function getChartTimeframe(id: ChartTimeframeId): ChartTimeframe {
  return CHART_TIMEFRAMES[id];
}
