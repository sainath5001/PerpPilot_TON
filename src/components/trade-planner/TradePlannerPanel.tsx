"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownRight, ArrowUpRight, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RiskPreview } from "@/components/trade-planner/RiskPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { analyzePosition, type RiskMetrics } from "@/lib/risk-engine";
import {
  defaultTradePlannerValues,
  tradePlannerSchema,
  type TradePlannerFormValues,
} from "@/lib/trade-planner/schema";
import { cn } from "@/lib/utils";
import { selectSelectedAsset, useChartStore } from "@/store/chart-store";

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export function TradePlannerPanel() {
  const selectedAsset = useChartStore(selectSelectedAsset);
  const selectedAssetId = useChartStore((s) => s.selectedAssetId);
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<TradePlannerFormValues>({
    resolver: zodResolver(tradePlannerSchema),
    defaultValues: defaultTradePlannerValues,
    mode: "onChange",
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const side = watch("side");
  const collateral = watch("collateral");
  const leverage = watch("leverage");
  const entryPrice = watch("entryPrice");

  const computedNotional =
    Number.isFinite(collateral) &&
    Number.isFinite(leverage) &&
    collateral > 0 &&
    leverage > 0
      ? collateral * leverage
      : null;

  const computedSizeBase =
    computedNotional !== null &&
    Number.isFinite(entryPrice) &&
    entryPrice > 0
      ? computedNotional / entryPrice
      : null;

  useEffect(() => {
    setValue("assetId", selectedAssetId, { shouldValidate: true });
  }, [selectedAssetId, setValue]);

  const onSubmit = form.handleSubmit((values) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    const result = analyzePosition({
      asset: values.assetId,
      side: values.side,
      entryPrice: values.entryPrice,
      collateral: values.collateral,
      leverage: values.leverage,
      stopLoss: values.stopLoss,
      takeProfit: values.takeProfit,
    });

    setIsAnalyzing(false);

    if (!result.success) {
      setMetrics(null);
      setAnalysisError(result.errors.join(" "));
      return;
    }

    setMetrics(result.metrics);
  });

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
          <Badge variant="success" className="shrink-0 text-[10px]">
            Synced
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-y-auto">
        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4">
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
                placeholder: "0.00",
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

          {(computedNotional !== null || computedSizeBase !== null) && (
            <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position Size</span>
                <span className="font-mono">
                  {computedNotional !== null
                    ? `$${computedNotional.toLocaleString()}`
                    : "—"}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Size (base)</span>
                <span className="font-mono">
                  {computedSizeBase !== null
                    ? `${computedSizeBase.toFixed(6)} ${selectedAsset.baseAsset}`
                    : "—"}
                </span>
              </div>
            </div>
          )}

          <Separator />

          <RiskPreview
            metrics={metrics}
            error={analysisError}
            isAnalyzing={isAnalyzing}
          />

          <Button type="submit" variant="trading" className="mt-auto w-full">
            <Calculator className="h-4 w-4" />
            Analyze Position
          </Button>
        </form>
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
