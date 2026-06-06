"use client";

import { cn } from "@/lib/utils";
import { getHealthScoreStyle } from "@/lib/risk-engine/health-utils";

interface HealthScoreGaugeProps {
  score: number;
  className?: string;
  size?: "md" | "lg";
}

export function HealthScoreGauge({
  score,
  className,
  size = "lg",
}: HealthScoreGaugeProps) {
  const style = getHealthScoreStyle(score);
  const clamped = Math.min(100, Math.max(0, score));
  const radius = size === "lg" ? 54 : 40;
  const stroke = size === "lg" ? 10 : 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (clamped / 100) * circumference;
  const dimension = radius * 2;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border p-6 shadow-lg",
        style.borderClass,
        style.bgClass,
        style.glowClass,
        className
      )}
    >
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/40"
          />
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-500 ease-out", style.ringClass)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-bold tabular-nums tracking-tight",
              size === "lg" ? "text-4xl" : "text-2xl",
              style.textClass
            )}
          >
            {Math.round(clamped)}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trade Health Score
        </p>
        <p className={cn("mt-1 text-lg font-bold", style.textClass)}>
          {style.label}
        </p>
      </div>

      <div className="mt-4 flex w-full gap-1">
        <BandLegend label="0–40" active={clamped <= 40} color="bg-red-500" />
        <BandLegend label="41–70" active={clamped > 40 && clamped <= 70} color="bg-amber-500" />
        <BandLegend label="71–100" active={clamped > 70} color="bg-emerald-500" />
      </div>
    </div>
  );
}

function BandLegend({
  label,
  active,
  color,
}: {
  label: string;
  active: boolean;
  color: string;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-md px-1 py-1.5 text-center text-[10px] font-medium transition-opacity",
        active ? "opacity-100" : "opacity-30"
      )}
    >
      <div className={cn("mx-auto mb-1 h-1 w-full rounded-full", color)} />
      {label}
    </div>
  );
}

export function HealthScoreGaugePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-8",
        className
      )}
    >
      <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
        <span className="text-3xl font-bold text-muted-foreground/40">—</span>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">
        Trade Health Score
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Enter entry price, collateral & leverage
      </p>
    </div>
  );
}
