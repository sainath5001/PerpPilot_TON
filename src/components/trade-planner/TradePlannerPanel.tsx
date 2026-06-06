"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownRight, ArrowUpRight, Calculator } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  defaultTradePlannerValues,
  tradePlannerSchema,
  type TradePlannerFormValues,
} from "@/lib/trade-planner/schema";
import { cn } from "@/lib/utils";
import { selectSelectedAsset, useChartStore } from "@/store/chart-store";

export function TradePlannerPanel() {
  const selectedAsset = useChartStore(selectSelectedAsset);
  const selectedAssetId = useChartStore((s) => s.selectedAssetId);

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

  useEffect(() => {
    setValue("assetId", selectedAssetId, { shouldValidate: true });
  }, [selectedAssetId, setValue]);

  const onSubmit = form.handleSubmit(() => {
    // Risk analysis engine will connect in a future prompt
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

      <CardContent className="flex flex-1 flex-col">
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
              label="Position Size"
              suffix={selectedAsset.baseAsset}
              error={errors.size?.message}
              inputProps={{
                ...register("size", { valueAsNumber: true }),
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
              label="Collateral"
              suffix={selectedAsset.quoteAsset}
              error={errors.collateral?.message}
              inputProps={{
                ...register("collateral", { valueAsNumber: true }),
                type: "number",
                step: "any",
                placeholder: "0.00",
              }}
            />
          </div>

          <Separator />

          <div className="rounded-lg border border-dashed border-border bg-muted/10 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Risk Preview
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <PreviewRow label="Health Score" value="—" />
              <PreviewRow label="Liquidation Price" value="—" />
              <PreviewRow label="Margin Ratio" value="—" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Risk engine connects in the next integration phase.
            </p>
          </div>

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
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
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

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  );
}
