import { MAINTENANCE_MARGIN_TIERS } from "./constants";
import type { PositionContext, RiskEngineInput } from "./types";

/**
 * Rounds a number to a fixed decimal precision for stable output.
 */
export function round(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Builds shared position context used by downstream calculators.
 */
export function buildPositionContext(input: RiskEngineInput): PositionContext {
  const entryPrice = input.entryPrice;
  const markPrice = input.markPrice ?? entryPrice;
  const collateral = input.collateral;
  const leverage = input.leverage;

  const notional = calculatePositionSizeNotional(collateral, leverage);
  const positionSizeBase = calculatePositionSizeBase(notional, entryPrice);
  const initialMargin = notional / leverage;
  const maintenanceMarginRate = resolveMaintenanceMarginRate(leverage);
  const maintenanceMargin = calculateMaintenanceMargin(
    notional,
    maintenanceMarginRate
  );

  return {
    side: input.side,
    entryPrice,
    markPrice,
    collateral,
    leverage,
    notional,
    positionSizeBase,
    initialMargin,
    maintenanceMarginRate,
    maintenanceMargin,
  };
}

/**
 * Notional position size in quote currency (USD).
 *
 * Formula: `notional = collateral × leverage`
 *
 * This is the total market exposure of the isolated position.
 * Equivalent to the "position value" shown on Hyperliquid / GMX dashboards.
 */
export function calculatePositionSize(
  collateral: number,
  leverage: number,
  entryPrice: number
): { notional: number; base: number } {
  const notional = calculatePositionSizeNotional(collateral, leverage);
  const base = calculatePositionSizeBase(notional, entryPrice);
  return { notional, base };
}

export function calculatePositionSizeNotional(
  collateral: number,
  leverage: number
): number {
  return collateral * leverage;
}

/**
 * Position size in base-asset units.
 *
 * Formula: `sizeBase = notional / entryPrice`
 */
export function calculatePositionSizeBase(
  notional: number,
  entryPrice: number
): number {
  if (entryPrice <= 0) return 0;
  return notional / entryPrice;
}

/**
 * Resolves tiered maintenance margin rate from leverage bucket.
 *
 * Tier model (GMX-inspired):
 * - ≤5x  → 0.40%
 * - ≤10x → 0.50%
 * - ≤25x → 1.00%
 * - ≤50x → 1.50%
 * - ≤100x → 2.50%
 */
export function resolveMaintenanceMarginRate(leverage: number): number {
  for (const tier of MAINTENANCE_MARGIN_TIERS) {
    if (leverage <= tier.maxLeverage) {
      return tier.rate;
    }
  }
  return MAINTENANCE_MARGIN_TIERS[MAINTENANCE_MARGIN_TIERS.length - 1].rate;
}

/**
 * Maintenance margin in quote currency.
 *
 * Formula: `maintenanceMargin = notional × maintenanceMarginRate`
 */
export function calculateMaintenanceMargin(
  notional: number,
  maintenanceMarginRate: number
): number {
  return notional * maintenanceMarginRate;
}

/**
 * Effective directional exposure (USD).
 *
 * For isolated margin perps, effective exposure equals notional:
 * `exposure = collateral × leverage`
 */
export function calculateExposure(collateral: number, leverage: number): number {
  return calculatePositionSizeNotional(collateral, leverage);
}
