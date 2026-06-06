"use client";

import { ArrowDownRight, ArrowUpRight, Radio } from "lucide-react";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LiveRiskAnalysis } from "@/hooks/use-live-risk-analysis";
import { getHealthScoreStyle } from "@/lib/risk-engine/health-utils";
import type { TradePlannerFormValues } from "@/lib/trade-planner/schema";
import { cn } from "@/lib/utils";
import { selectSelectedAsset, useChartStore } from "@/store/chart-store";

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

interface TradePlannerPanelProps {
  form: UseFormReturn<TradePlannerFormValues>;
  analysis: LiveRiskAnalysis;
}

export function TradePlannerPanel({ form, analysis }: TradePlannerPanelProps) {
  const selectedAsset = useChartStore(selectSelectedAsset);
  const selectedAssetId = useChartStore((s) => s.selectedAssetId);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const side = watch("side");
  const healthScore = analysis.metrics?.healthScore;

  useEffect(() => {
    setValue("assetId", selectedAssetId, { shouldValidate: true });
  }, [selectedAssetId, setValue]);

  const healthStyle =
    healthScore !== undefined ? getHealthScoreStyle(healthScore) : null;

  return (
    <Card className="flex h-full flex-col border-border/80 bg-card/60">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Trade Planner</CardTitle>
            <CardDescription>
              Plan your perpetual position before execution
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 font-mono">
            {selectedAsset.shortLabel}-PERP
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: selectedAsset.iconColor }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{selectedAsset.label}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {selectedAsset.tradingViewSymbol}
            </p>
          </div>
          {analysis.metrics ? (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 font-mono text-[10px]",
                healthStyle?.textClass
              )}
            >
              {analysis.metrics.healthScore}
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              Pending
            </Badge>
          )}
        </div>

        {analysis.isReady && analysis.metrics && (
          <div
            className={cn(
              "mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
              healthStyle?.borderClass,
              healthStyle?.bgClass
            )}
          >
            <Radio className={cn("h-3 w-3 animate-pulse", healthStyle?.textClass)} />
            <span className="text-muted-foreground">Live risk engine</span>
            <span className={cn("ml-auto font-semibold", healthStyle?.textClass)}>
              {healthStyle?.label}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue("side", "long", { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                side === "long"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowUpRight className="h-4 w-4" />
              Long
            </button>
            <button
              type="button"
              onClick={() => setValue("side", "short", { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                side === "short"
                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                  : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowDownRight className="h-4 w-4" />
              Short
            </button>
          </div>

          <input type="hidden" {...register("assetId")} />

          <div className="space-y-3">
            <Field
              label="Entry Price"
              suffix="USD"
              error={errors.entryPrice?.message}
              inputProps={{
                ...register("entryPrice", { valueAsNumber: true }),
                type: "number",
                step: "any",
                placeholder: "0.00",
              }}
            />
            <Field
              label="Collateral"
              suffix="USD"
              error={errors.collateral?.message}
              inputProps={{
                ...register("collateral", { valueAsNumber: true }),
                type: "number",
                step: "any",
                placeholder: "1000.00",
              }}
            />
            <Field
              label="Leverage"
              suffix="x"
              error={errors.leverage?.message}
              inputProps={{
                ...register("leverage", { valueAsNumber: true }),
                type: "number",
                min: 1,
                max: 100,
                step: 1,
                placeholder: "10",
              }}
            />
            <Field
              label="Stop Loss"
              suffix="USD"
              error={errors.stopLoss?.message}
              inputProps={{
                ...register("stopLoss", { setValueAs: parseOptionalNumber }),
                type: "number",
                step: "any",
                placeholder: "Optional",
              }}
            />
            <Field
              label="Take Profit"
              suffix="USD"
              error={errors.takeProfit?.message}
              inputProps={{
                ...register("takeProfit", { setValueAs: parseOptionalNumber }),
                type: "number",
                step: "any",
                placeholder: "Optional",
              }}
            />
          </div>

          <p className="mt-auto text-center text-[11px] text-muted-foreground">
            Metrics update instantly · client-side only
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  suffix,
  error,
  inputProps,
}: {
  label: string;
  suffix: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-14 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30",
            error &&
              "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
          )}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
