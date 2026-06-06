import type { PositionContext } from "./types";
import type { PositionSide } from "@/types/trading";

/**
 * Estimated liquidation price for an isolated-margin perpetual.
 *
 * Liquidation occurs when remaining margin equals maintenance margin:
 *
 * Long:
 *   `collateral - sizeBase × (entry - liqPrice) = maintenanceMargin`
 *   `liqPrice = entry - (collateral - maintenanceMargin) / sizeBase`
 *
 * Short:
 *   `collateral - sizeBase × (liqPrice - entry) = maintenanceMargin`
 *   `liqPrice = entry + (collateral - maintenanceMargin) / sizeBase`
 *
 * If `collateral ≤ maintenanceMargin`, the position is already liquidatable
 * and liquidation price is set to entry (immediate risk).
 */
export function calculateLiquidationPrice(context: PositionContext): number {
  const {
    side,
    entryPrice,
    collateral,
    maintenanceMargin,
    positionSizeBase,
  } = context;

  if (positionSizeBase <= 0) {
    return side === "long" ? 0 : entryPrice * 2;
  }

  const marginAboveMaintenance = collateral - maintenanceMargin;

  if (marginAboveMaintenance <= 0) {
    return entryPrice;
  }

  const priceDelta = marginAboveMaintenance / positionSizeBase;

  if (side === "long") {
    const liqPrice = entryPrice - priceDelta;
    return Math.max(0, liqPrice);
  }

  return entryPrice + priceDelta;
}

/**
 * Distance from mark price to liquidation, expressed as a percentage.
 *
 * Formula:
 *   Long:  `(markPrice - liqPrice) / markPrice × 100`
 *   Short: `(liqPrice - markPrice) / markPrice × 100`
 *
 * Returns 0 if already liquidatable (mark at/beyond liq).
 */
export function calculateDistanceToLiquidation(
  side: PositionSide,
  markPrice: number,
  liquidationPrice: number
): number {
  if (markPrice <= 0) return 0;

  if (side === "long") {
    if (markPrice <= liquidationPrice) return 0;
    return ((markPrice - liquidationPrice) / markPrice) * 100;
  }

  if (markPrice >= liquidationPrice) return 0;
  return ((liquidationPrice - markPrice) / markPrice) * 100;
}

/**
 * Initial margin utilization as percentage of collateral.
 *
 * Formula: `(initialMargin / collateral) × 100`
 *
 * With full collateral deployment (isolated), this is typically 100%.
 */
export function calculateMarginUtilization(
  initialMargin: number,
  collateral: number
): number {
  if (collateral <= 0) return 100;
  return Math.min(100, (initialMargin / collateral) * 100);
}

/**
 * Margin buffer above maintenance requirement, as % of collateral.
 *
 * Formula: `((collateral - maintenanceMargin) / collateral) × 100`
 *
 * Represents how much of posted collateral remains before hitting
 * the maintenance threshold (excluding unrealized PnL).
 */
export function calculateMarginBuffer(
  collateral: number,
  maintenanceMargin: number
): number {
  if (collateral <= 0) return 0;
  const buffer = ((collateral - maintenanceMargin) / collateral) * 100;
  return Math.max(0, buffer);
}
