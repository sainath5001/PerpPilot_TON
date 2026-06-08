"use client";

import { useEffect, useState } from "react";
import { Radio, Zap } from "lucide-react";
import { ChartToolbar } from "@/components/chart/ChartToolbar";
import { TradingChartPanel } from "@/components/chart/TradingChartPanel";
import { FundingModal, FundingPanel } from "@/components/omniston";
import { RiskOverviewSection } from "@/components/risk/RiskOverviewSection";
import { TradePlannerPanel } from "@/components/trade-planner/TradePlannerPanel";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useLiveRiskAnalysis } from "@/hooks/use-live-risk-analysis";
import { useTradePlannerForm } from "@/hooks/use-trade-planner-form";
import { cn, truncateAddress } from "@/lib/utils";
import { getChartAsset } from "@/lib/chart/assets";
import { useChartStore } from "@/store/chart-store";
import { useWalletStore } from "@/store/wallet-store";

export function TradingTerminal() {
  const wallet = useWalletStore((s) => s.wallet);
  const assetId = useChartStore((s) => s.selectedAssetId);
  const asset = getChartAsset(assetId);
  const setFullscreen = useChartStore((s) => s.setFullscreen);
  const { ref, isFullscreen, toggleFullscreen, exitFullscreen } =
    useFullscreen<HTMLDivElement>();

  const form = useTradePlannerForm();
  const values = form.watch();
  const analysis = useLiveRiskAnalysis(values);
  const requiredCollateral = values.collateral > 0 ? values.collateral : 0;
  const [fundingModalOpen, setFundingModalOpen] = useState(false);

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
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="success" className="gap-1">
                <Radio className="h-3 w-3 animate-pulse-soft" />
                Live Terminal
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px]">
                {asset.shortLabel}-PERP
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight xl:text-3xl">
              Perpetual Risk Terminal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {wallet
                ? `Connected · ${truncateAddress(wallet.address, 6)}`
                : "Analyze positions before execution"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {requiredCollateral > 0 && wallet && (
              <FundingModal
                requiredCollateralUsd={requiredCollateral}
                open={fundingModalOpen}
                onOpenChange={setFundingModalOpen}
              />
            )}
            {analysis.metrics && (
              <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-2 text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Health Score
                </p>
                <p
                  className={cn(
                    "font-mono text-3xl font-bold tabular-nums leading-none",
                    analysis.metrics.healthScore <= 40
                      ? "text-red-400"
                      : analysis.metrics.healthScore <= 70
                        ? "text-amber-400"
                        : "text-emerald-400"
                  )}
                >
                  {analysis.metrics.healthScore}
                </p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div
          className={cn(
            "grid grid-cols-1 gap-4 xl:grid-cols-[7fr_3fr]",
            isFullscreen && "fixed inset-0 z-50 gap-0 bg-background p-0"
          )}
        >
          <div
            ref={ref}
            className={cn(
              "flex min-h-[460px] flex-col overflow-hidden rounded-xl border border-border/60 bg-[#0a0e13] shadow-lg shadow-black/20 xl:min-h-[580px]",
              isFullscreen && "min-h-screen rounded-none border-0 shadow-none"
            )}
          >
            <ChartToolbar
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
            <TradingChartPanel className="min-h-0 flex-1" />
          </div>

          {!isFullscreen && (
            <div className="min-h-[380px] xl:min-h-[500px]">
              <TradePlannerPanel form={form} analysis={analysis} />
            </div>
          )}
        </div>
      </FadeIn>

      {!isFullscreen && (
        <>
          <FadeIn delay={160}>
            <RiskOverviewSection analysis={analysis} values={values} />
          </FadeIn>

          {requiredCollateral > 0 && (
            <FadeIn delay={240}>
              <div id="funding" className="scroll-mt-24">
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-lg font-bold">Collateral Funding</h2>
                  <Badge variant="outline" className="text-[10px]">
                    STON.fi Omniston
                  </Badge>
                </div>
                <FundingPanel requiredCollateralUsd={requiredCollateral} />
              </div>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
