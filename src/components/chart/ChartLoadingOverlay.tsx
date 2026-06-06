"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartLoadingOverlayProps {
  label?: string;
}

export function ChartLoadingOverlay({
  label = "Loading TradingView chart…",
}: ChartLoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-sm">
      <div className="relative">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-400" />
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="absolute inset-x-8 bottom-8 space-y-2.5 opacity-30">
        <Skeleton className="h-2.5 w-full animate-shimmer" />
        <Skeleton className="h-2.5 w-4/5 animate-shimmer" />
        <Skeleton className="h-2.5 w-3/5 animate-shimmer" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}
