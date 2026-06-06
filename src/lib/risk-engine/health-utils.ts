/**
 * UI health score bands for the trading terminal.
 * 0–40 Dangerous · 41–70 Moderate · 71–100 Healthy
 */

export type HealthScoreBand = "dangerous" | "moderate" | "healthy";

export interface HealthScoreStyle {
  band: HealthScoreBand;
  label: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  ringClass: string;
  gaugeClass: string;
  glowClass: string;
}

const STYLES: Record<HealthScoreBand, HealthScoreStyle> = {
  dangerous: {
    band: "dangerous",
    label: "Dangerous",
    textClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    ringClass: "stroke-red-500",
    gaugeClass: "from-red-600 to-red-400",
    glowClass: "shadow-red-500/20",
  },
  moderate: {
    band: "moderate",
    label: "Moderate",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    ringClass: "stroke-amber-500",
    gaugeClass: "from-amber-600 to-amber-400",
    glowClass: "shadow-amber-500/20",
  },
  healthy: {
    band: "healthy",
    label: "Healthy",
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    ringClass: "stroke-emerald-500",
    gaugeClass: "from-emerald-600 to-emerald-400",
    glowClass: "shadow-emerald-500/20",
  },
};

export function getHealthScoreBand(score: number): HealthScoreBand {
  if (score <= 40) return "dangerous";
  if (score <= 70) return "moderate";
  return "healthy";
}

export function getHealthScoreStyle(score: number): HealthScoreStyle {
  return STYLES[getHealthScoreBand(score)];
}
