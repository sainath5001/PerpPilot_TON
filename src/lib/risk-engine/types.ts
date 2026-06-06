import type { ChartAssetId } from "@/types/chart";
import type { PositionSide, RiskLevel } from "@/types/trading";

/**
 * Raw inputs for the isolated-margin perpetual risk engine.
 * Inspired by GMX v2 / Hyperliquid position modeling.
 */
export interface RiskEngineInput {
  /** Perp market identifier (e.g. BTCUSD) */
  asset: ChartAssetId | string;
  /** Trade direction */
  side: PositionSide;
  /** Planned entry price in quote currency (USD) */
  entryPrice: number;
  /** Isolated collateral posted in quote currency (USD) */
  collateral: number;
  /** Position leverage multiplier (1x–100x) */
  leverage: number;
  /** Optional stop-loss price in quote currency */
  stopLoss?: number;
  /** Optional take-profit price in quote currency */
  takeProfit?: number;
  /** Mark price override; defaults to entryPrice for pre-trade analysis */
  markPrice?: number;
}

/**
 * Intermediate values shared across risk calculations.
 */
export interface PositionContext {
  side: PositionSide;
  entryPrice: number;
  markPrice: number;
  collateral: number;
  leverage: number;
  /** Notional position value: collateral × leverage */
  notional: number;
  /** Position size in base-asset units: notional / entryPrice */
  positionSizeBase: number;
  /** Initial margin (equals collateral in full isolated deployment) */
  initialMargin: number;
  /** Maintenance margin rate applied to notional (tiered by leverage) */
  maintenanceMarginRate: number;
  /** Maintenance margin in quote currency */
  maintenanceMargin: number;
}

/**
 * Complete risk analysis output for a perpetual trade plan.
 */
export interface RiskMetrics {
  /** Asset identifier echoed from input */
  asset: string;
  /** Trade direction */
  side: PositionSide;

  // --- Position ---
  /** Notional exposure in quote currency (USD) */
  positionSizeNotional: number;
  /** Position size in base-asset units */
  positionSizeBase: number;
  /** Effective directional exposure (notional for isolated margin) */
  effectiveExposure: number;

  // --- Margin ---
  /** Initial margin posted (USD) */
  initialMargin: number;
  /** Maintenance margin required at current notional (USD) */
  maintenanceMargin: number;
  /** Maintenance margin rate applied (decimal, e.g. 0.01 = 1%) */
  maintenanceMarginRate: number;
  /** Initial margin as % of collateral (typically 100% when fully deployed) */
  marginUtilization: number;
  /** Remaining collateral buffer above maintenance, as % of collateral */
  marginBufferPercentage: number;

  // --- Liquidation ---
  /** Estimated liquidation price (USD) */
  estimatedLiquidationPrice: number;
  /** Distance from mark price to liquidation, as % of mark price */
  distanceToLiquidation: number;

  // --- PnL scenarios ---
  /** Max loss at stop-loss (USD), or collateral if no valid SL */
  maximumLoss: number;
  /** Profit at take-profit (USD), null if TP not set/invalid */
  potentialProfit: number | null;
  /** Reward-to-risk ratio (profit / loss), null if not computable */
  riskRewardRatio: number | null;

  // --- Health ---
  /** Composite trade health score (0–100) */
  healthScore: number;
  /** Derived risk band from health score */
  riskLevel: RiskLevel;

  /** Whether the position is already at/below maintenance threshold */
  isLiquidatable: boolean;
  /** Non-fatal warnings (e.g. SL beyond liquidation) */
  warnings: string[];
}

export interface RiskEngineResult {
  success: true;
  metrics: RiskMetrics;
  context: PositionContext;
}

export interface RiskEngineError {
  success: false;
  errors: string[];
}

export type RiskAnalysisResult = RiskEngineResult | RiskEngineError;

export interface HealthScoreBreakdown {
  leverageScore: number;
  liquidationDistanceScore: number;
  marginBufferScore: number;
  riskRewardScore: number;
  stopLossScore: number;
  weightedTotal: number;
}
