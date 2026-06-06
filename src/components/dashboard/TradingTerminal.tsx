"use client";

import { useEffect } from "react";
import { ChartToolbar } from "@/components/chart/ChartToolbar";
import { TradingViewChart } from "@/components/chart/TradingViewChart";
import { TradePlannerPanel } from "@/components/trade-planner/TradePlannerPanel";
import { Badge } from "@/components/ui/badge";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn, truncateAddress } from "@/lib/utils";
import {
  selectTradingViewSymbol,
  useChartStore,
} from "@/store/chart-store";
import { useWalletStore } from "@/store/wallet-store";

export function TradingTerminal() {
  const wallet = useWalletStore((s) => s.wallet);
  const symbol = useChartStore(selectTradingViewSymbol);
  const timeframe = useChartStore((s) => s.selectedTimeframeId);
  const setFullscreen = useChartStore((s) => s.setFullscreen);
  const { ref, isFullscreen, toggleFullscreen, exitFullscreen } =
    useFullscreen<HTMLDivElement>();

  useEffect(() => {
    setFullscreen(isFullscreen);
  }, [isFullscreen, setFullscreen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        void exitFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitFullscreen, isFullscreen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="success" className="mb-2">
            Live Terminal
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight xl:text-3xl">
            Perpetual Risk Terminal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wallet
              ? `Connected · ${truncateAddress(wallet.address, 6)}`
              : "Analyze positions before execution"}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4 xl:grid-cols-[7fr_3fr]",
          isFullscreen && "fixed inset-0 z-50 gap-0 bg-background p-0"
        )}
      >
        <div
          ref={ref}
          className={cn(
            "flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-card/40 xl:min-h-[640px]",
            isFullscreen && "min-h-screen rounded-none border-0"
          )}
        >
          <ChartToolbar
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
          <div className="relative min-h-0 flex-1">
            <TradingViewChart
              symbol={symbol}
              interval={timeframe}
              className="absolute inset-0"
            />
          </div>
        </div>

        {!isFullscreen && (
          <div className="min-h-[480px] xl:min-h-[640px]">
            <TradePlannerPanel />
          </div>
        )}
      </div>
    </div>
  );
}
