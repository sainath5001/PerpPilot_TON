import { calculateHealthScore, resolveRiskLevel } from "./calculate-health-score";
import {
  calculateDistanceToLiquidation,
  calculateLiquidationPrice,
  calculateMarginBuffer,
  calculateMarginUtilization,
} from "./calculate-liquidation-price";
import {
  calculatePotentialPnL,
  calculateRiskReward,
} from "./calculate-potential-pnl";
import {
  buildPositionContext,
  calculateExposure,
  round,
} from "./calculate-position-size";
import { OUTPUT_DECIMALS, PERCENT_DECIMALS } from "./constants";
import type {
  RiskAnalysisResult,
  RiskEngineInput,
  RiskMetrics,
} from "./types";
import {
  collectRiskWarnings,
  validateRiskInput,
} from "./validation";

/**
 * Main entry point: validates inputs, runs all risk calculations,
 * and returns a typed RiskMetrics object.
 */
export function analyzePosition(input: RiskEngineInput): RiskAnalysisResult {
  const errors = validateRiskInput(input);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const context = buildPositionContext(input);

  const estimatedLiquidationPrice = calculateLiquidationPrice(context);
  const distanceToLiquidation = calculateDistanceToLiquidation(
    context.side,
    context.markPrice,
    estimatedLiquidationPrice
  );
  const marginUtilization = calculateMarginUtilization(
    context.initialMargin,
    context.collateral
  );
  const marginBufferPercentage = calculateMarginBuffer(
    context.collateral,
    context.maintenanceMargin
  );
  const effectiveExposure = calculateExposure(
    context.collateral,
    context.leverage
  );

  const { maximumLoss, potentialProfit } = calculatePotentialPnL(
    context,
    input.stopLoss,
    input.takeProfit
  );
  const riskRewardRatio = calculateRiskReward(potentialProfit, maximumLoss);

  const { healthScore } = calculateHealthScore({
    leverage: context.leverage,
    distanceToLiquidation,
    marginBufferPercentage,
    riskRewardRatio,
    side: context.side,
    entryPrice: context.entryPrice,
    stopLoss: input.stopLoss,
    liquidationPrice: estimatedLiquidationPrice,
  });

  const isLiquidatable = context.collateral <= context.maintenanceMargin;
  const warnings = collectRiskWarnings(input, estimatedLiquidationPrice);

  const metrics: RiskMetrics = {
    asset: String(input.asset),
    side: context.side,
    positionSizeNotional: round(context.notional, OUTPUT_DECIMALS),
    positionSizeBase: round(context.positionSizeBase, OUTPUT_DECIMALS),
    effectiveExposure: round(effectiveExposure, OUTPUT_DECIMALS),
    initialMargin: round(context.initialMargin, OUTPUT_DECIMALS),
    maintenanceMargin: round(context.maintenanceMargin, OUTPUT_DECIMALS),
    maintenanceMarginRate: round(context.maintenanceMarginRate, PERCENT_DECIMALS),
    marginUtilization: round(marginUtilization, PERCENT_DECIMALS),
    marginBufferPercentage: round(marginBufferPercentage, PERCENT_DECIMALS),
    estimatedLiquidationPrice: round(
      estimatedLiquidationPrice,
      OUTPUT_DECIMALS
    ),
    distanceToLiquidation: round(distanceToLiquidation, PERCENT_DECIMALS),
    maximumLoss: round(maximumLoss, OUTPUT_DECIMALS),
    potentialProfit:
      potentialProfit !== null
        ? round(potentialProfit, OUTPUT_DECIMALS)
        : null,
    riskRewardRatio:
      riskRewardRatio !== null
        ? round(riskRewardRatio, PERCENT_DECIMALS)
        : null,
    healthScore,
    riskLevel: resolveRiskLevel(healthScore),
    isLiquidatable,
    warnings,
  };

  return { success: true, metrics, context };
}

/**
 * Convenience wrapper that throws on validation failure.
 */
export function analyzePositionOrThrow(input: RiskEngineInput): RiskMetrics {
  const result = analyzePosition(input);
  if (!result.success) {
    throw new Error(result.errors.join(" "));
  }
  return result.metrics;
}
