"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { AssetSelector } from "@/components/chart/AssetSelector";
import { TimeframeSelector } from "@/components/chart/TimeframeSelector";
import { Button } from "@/components/ui/button";
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
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-border/60 bg-[#0a0e13] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4",
        className
      )}
    >
      <AssetSelector />

      <div className="flex items-center gap-2">
        <TimeframeSelector className="max-w-full" />
        {onToggleFullscreen && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 border-border/60 bg-transparent"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
