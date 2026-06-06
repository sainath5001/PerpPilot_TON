"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { AssetSelector } from "@/components/chart/AssetSelector";
import { TimeframeSelector } from "@/components/chart/TimeframeSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { selectSelectedAsset, useChartStore } from "@/store/chart-store";
import { cn } from "@/lib/utils";

interface ChartToolbarProps {
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function ChartToolbar({
  className,
  isFullscreen = false,
  onToggleFullscreen,
}: ChartToolbarProps) {
  const asset = useChartStore(selectSelectedAsset);
  const loadState = useChartStore((s) => s.loadState);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border bg-card/40 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AssetSelector />
        <div className="hidden h-6 w-px bg-border sm:block" />
        <div className="flex items-center gap-2">
          <span className="hidden text-xs uppercase tracking-wider text-muted-foreground sm:inline">
            Perp
          </span>
          <Badge variant="outline" className="font-mono text-xs">
            {asset.id}
          </Badge>
          {loadState === "loading" && (
            <Badge variant="secondary" className="text-[10px] uppercase">
              Syncing
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TimeframeSelector className="max-w-full" />
        {onToggleFullscreen && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
