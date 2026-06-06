"use client";

import { CHART_ASSET_LIST } from "@/lib/chart/assets";
import { cn } from "@/lib/utils";
import { useChartStore } from "@/store/chart-store";
import type { ChartAssetId } from "@/types/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetSelectorProps {
  className?: string;
  compact?: boolean;
}

export function AssetSelector({ className, compact = false }: AssetSelectorProps) {
  const selectedAssetId = useChartStore((s) => s.selectedAssetId);
  const setAsset = useChartStore((s) => s.setAsset);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact && (
        <div className="hidden items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 lg:flex">
          {CHART_ASSET_LIST.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => setAsset(asset.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                selectedAssetId === asset.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: asset.iconColor }}
              />
              {asset.shortLabel}
              <span className="text-xs text-muted-foreground">/ USD</span>
            </button>
          ))}
        </div>
      )}

      <Select
        value={selectedAssetId}
        onValueChange={(value) => setAsset(value as ChartAssetId)}
      >
        <SelectTrigger
          className={cn(
            "h-9 w-[140px] border-border bg-muted/30 font-medium lg:hidden",
            compact && "lg:flex lg:w-[160px]"
          )}
        >
          <SelectValue placeholder="Select asset" />
        </SelectTrigger>
        <SelectContent>
          {CHART_ASSET_LIST.map((asset) => (
            <SelectItem key={asset.id} value={asset.id}>
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: asset.iconColor }}
                />
                {asset.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
