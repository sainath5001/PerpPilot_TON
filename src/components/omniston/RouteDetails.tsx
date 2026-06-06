"use client";

import { ArrowRight, Route } from "lucide-react";
import type { Quote } from "@ston-fi/omniston-sdk";
import { Badge } from "@/components/ui/badge";
import type { OmnistonAssetMeta } from "@/lib/omniston/assets";
import {
  extractRouteSteps,
  getUniqueProtocols,
} from "@/lib/omniston/route-utils";
import { formatBaseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RouteDetailsProps {
  quote: Quote | null;
  inputAsset: OmnistonAssetMeta;
  outputAsset: OmnistonAssetMeta;
  className?: string;
}

export function RouteDetails({
  quote,
  inputAsset,
  outputAsset,
  className,
}: RouteDetailsProps) {
  if (!quote) return null;

  const steps = extractRouteSteps(quote, inputAsset, outputAsset);
  const protocols = getUniqueProtocols(steps);

  if (steps.length === 0) {
    return (
      <div className={cn("rounded-lg border border-border/60 bg-muted/10 p-4", className)}>
        <p className="text-sm text-muted-foreground">No route details available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Route className="h-4 w-4 text-cyan-400" />
          Best Route
        </div>
        <div className="flex flex-wrap gap-1">
          {protocols.map((protocol) => (
            <Badge key={protocol} variant="outline" className="text-[10px] uppercase">
              {protocol}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={`${step.routeIndex}-${step.stepIndex}-${step.chunkIndex}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-mono text-xs text-muted-foreground">
                {step.protocol}
              </span>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs">
                {formatBaseAmount(step.inputAmount, inputAsset.symbol)}
              </span>
            </div>
            <span className="shrink-0 font-mono text-xs text-emerald-400">
              {formatBaseAmount(step.outputAmount, outputAsset.symbol)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
