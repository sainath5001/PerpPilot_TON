import {
  HEALTH_SCORE_WEIGHTS,
  INVALID_STOP_LOSS_SCORE,
  MAX_LEVERAGE,
  MISSING_STOP_LOSS_SCORE,
  NEUTRAL_PARTIAL_SCORE,
  RISK_LEVEL_THRESHOLDS,
} from "./constants";
import type { HealthScoreBreakdown } from "./types";
import type { PositionSide, RiskLevel } from "@/types/trading";

export interface HealthScoreInput {
  leverage: number;
  distanceToLiquidation: number;
  marginBufferPercentage: number;
  riskRewardRatio: number | null;
  side: PositionSide;
  entryPrice: number;
  stopLoss?: number;
  liquidationPrice: number;
}

/**
 * Composite trade health score (0–100).
 *
 * Weighted factors:
 * - Leverage (25%): lower leverage → higher score
 * - Distance to liquidation (25%): wider buffer → higher score
 * - Margin buffer (20%): more collateral headroom → higher score
 * - Risk-reward ratio (20%): higher RR → higher score
 * - Stop-loss placement (10%): SL between entry and liq → higher score
 */
export function calculateHealthScore(input: HealthScoreInput): {
  healthScore: number;
  breakdown: HealthScoreBreakdown;
} {
  const leverageScore = scoreLeverage(input.leverage);
  const liquidationDistanceScore = scoreLiquidationDistance(
    input.distanceToLiquidation
  );
  const marginBufferScore = scoreMarginBuffer(input.marginBufferPercentage);
  const riskRewardScore = scoreRiskReward(input.riskRewardRatio);
  const stopLossScore = scoreStopLossPlacement(input);

  const weightedTotal =
    leverageScore * HEALTH_SCORE_WEIGHTS.leverage +
    liquidationDistanceScore * HEALTH_SCORE_WEIGHTS.liquidationDistance +
    marginBufferScore * HEALTH_SCORE_WEIGHTS.marginBuffer +
    riskRewardScore * HEALTH_SCORE_WEIGHTS.riskReward +
    stopLossScore * HEALTH_SCORE_WEIGHTS.stopLoss;

  const healthScore = clamp(Math.round(weightedTotal), 0, 100);

  return {
    healthScore,
    breakdown: {
      leverageScore,
      liquidationDistanceScore,
      marginBufferScore,
      riskRewardScore,
      stopLossScore,
      weightedTotal: healthScore,
    },
  };
}

/**
 * Leverage score: 100 at 1x, linearly decays to 0 at MAX_LEVERAGE.
 *
 * Formula: `100 × (1 - (leverage - 1) / (MAX_LEVERAGE - 1))`
 */
export function scoreLeverage(leverage: number): number {
  if (leverage <= 1) return 100;
  if (leverage >= MAX_LEVERAGE) return 0;
  return 100 * (1 - (leverage - 1) / (MAX_LEVERAGE - 1));
}

/**
 * Liquidation distance score: 5% distance ≈ 25 points, caps at 100 (≥20% distance).
 *
 * Formula: `min(100, distanceToLiquidation × 5)`
 */
export function scoreLiquidationDistance(distancePct: number): number {
  return clamp(distancePct * 5, 0, 100);
}

/**
 * Margin buffer score: direct mapping, capped at 100%.
 */
export function scoreMarginBuffer(marginBufferPct: number): number {
  return clamp(marginBufferPct, 0, 100);
}

/**
 * Risk-reward score: RR=3 → 100, RR=1 → ~33, RR=0 → 0.
 *
 * Formula: `min(100, riskRewardRatio × 33.33)`
 * Neutral 50 when RR not available.
 */
export function scoreRiskReward(riskRewardRatio: number | null): number {
  if (riskRewardRatio === null) return NEUTRAL_PARTIAL_SCORE;
  return clamp(riskRewardRatio * 33.33, 0, 100);
}

/**
 * Stop-loss placement score:
 * - Missing SL → 30
 * - SL beyond liquidation (wrong side) → 0
 * - SL well placed → up to 100 based on relative distance from entry vs liq
 */
export function scoreStopLossPlacement(input: HealthScoreInput): number {
  const { side, entryPrice, stopLoss, liquidationPrice } = input;

  if (stopLoss === undefined) {
    return MISSING_STOP_LOSS_SCORE;
  }

  if (side === "long") {
    if (stopLoss <= liquidationPrice) return INVALID_STOP_LOSS_SCORE;
    const totalRange = entryPrice - liquidationPrice;
    if (totalRange <= 0) return INVALID_STOP_LOSS_SCORE;
    const slPosition = (entryPrice - stopLoss) / totalRange;
    return clamp(slPosition * 100, 20, 100);
  }

  if (stopLoss >= liquidationPrice) return INVALID_STOP_LOSS_SCORE;
  const totalRange = liquidationPrice - entryPrice;
  if (totalRange <= 0) return INVALID_STOP_LOSS_SCORE;
  const slPosition = (stopLoss - entryPrice) / totalRange;
  return clamp(slPosition * 100, 20, 100);
}

/**
 * Maps health score to risk level band.
 */
export function resolveRiskLevel(healthScore: number): RiskLevel {
  if (healthScore >= RISK_LEVEL_THRESHOLDS.low) return "low";
  if (healthScore >= RISK_LEVEL_THRESHOLDS.medium) return "medium";
  if (healthScore >= RISK_LEVEL_THRESHOLDS.high) return "high";
  return "critical";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
