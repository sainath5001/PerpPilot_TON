"use client";

import { CHART_TIMEFRAME_LIST } from "@/lib/chart/timeframes";
import { cn } from "@/lib/utils";
import { useChartStore } from "@/store/chart-store";
import type { ChartTimeframeId } from "@/types/chart";

interface TimeframeSelectorProps {
  className?: string;
}

export function TimeframeSelector({ className }: TimeframeSelectorProps) {
  const selectedTimeframeId = useChartStore((s) => s.selectedTimeframeId);
  const setTimeframe = useChartStore((s) => s.setTimeframe);

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 overflow-x-auto rounded-lg border border-border bg-muted/20 p-0.5",
        className
      )}
    >
      {CHART_TIMEFRAME_LIST.map((timeframe) => (
        <button
          key={timeframe.id}
          type="button"
          onClick={() => setTimeframe(timeframe.id as ChartTimeframeId)}
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
            selectedTimeframeId === timeframe.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {timeframe.shortLabel}
        </button>
      ))}
    </div>
  );
}
