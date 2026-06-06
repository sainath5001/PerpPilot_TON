export type PositionSide = "long" | "short";

export type RiskLevel = "low" | "medium" | "high" | "critical";

/** @deprecated Use RiskEngineInput from lib/risk-engine */
export interface PositionAnalysisInput {
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  size: number;
  leverage: number;
  collateral: number;
  liquidationPrice?: number;
}

export type { RiskMetrics } from "@/lib/risk-engine/types";

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}
