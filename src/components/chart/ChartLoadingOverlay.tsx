"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartLoadingOverlayProps {
  label?: string;
}

export function ChartLoadingOverlay({
  label = "Loading chart...",
}: ChartLoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="absolute inset-x-6 bottom-6 space-y-2 opacity-40">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}
