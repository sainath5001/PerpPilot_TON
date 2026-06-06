export type PositionSide = "long" | "short";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface PositionAnalysisInput {
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  size: number;
  leverage: number;
  collateral: number;
  liquidationPrice?: number;
}

export interface RiskMetrics {
  healthScore: number;
  riskLevel: RiskLevel;
  liquidationDistance: number;
  marginRatio: number;
  maxDrawdown: number;
  fundingImpact: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}
