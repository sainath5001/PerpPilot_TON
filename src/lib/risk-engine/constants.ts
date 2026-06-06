/**
 * Protocol constants for the PerpPilot isolated-margin risk model.
 * Maintenance tiers mirror common CEX / GMX-style leverage buckets.
 */

/** Maximum supported leverage */
export const MAX_LEVERAGE = 100;

/** Minimum supported leverage */
export const MIN_LEVERAGE = 1;

/** Minimum entry price (prevents division by zero) */
export const MIN_ENTRY_PRICE = 1e-8;

/** Minimum collateral (USD) */
export const MIN_COLLATERAL = 0.01;

/**
 * Maintenance margin rate tiers keyed by max leverage in bucket.
 * Higher leverage → higher maintenance requirement.
 */
export const MAINTENANCE_MARGIN_TIERS: ReadonlyArray<{
  maxLeverage: number;
  rate: number;
}> = [
  { maxLeverage: 5, rate: 0.004 },
  { maxLeverage: 10, rate: 0.005 },
  { maxLeverage: 25, rate: 0.01 },
  { maxLeverage: 50, rate: 0.015 },
  { maxLeverage: 100, rate: 0.025 },
];

/**
 * Health score factor weights (must sum to 1.0).
 */
export const HEALTH_SCORE_WEIGHTS = {
  leverage: 0.25,
  liquidationDistance: 0.25,
  marginBuffer: 0.2,
  riskReward: 0.2,
  stopLoss: 0.1,
} as const;

/** Health score thresholds for risk level bands */
export const RISK_LEVEL_THRESHOLDS = {
  low: 75,
  medium: 50,
  high: 25,
} as const;

/** Neutral score used when optional inputs (SL/TP/RR) are absent */
export const NEUTRAL_PARTIAL_SCORE = 50;

/** Penalty score when stop-loss is missing */
export const MISSING_STOP_LOSS_SCORE = 30;

/** Penalty score when stop-loss is invalid (beyond liquidation) */
export const INVALID_STOP_LOSS_SCORE = 0;

/** Decimal precision for output rounding */
export const OUTPUT_DECIMALS = 6;

/** Percentage precision for display metrics */
export const PERCENT_DECIMALS = 4;
