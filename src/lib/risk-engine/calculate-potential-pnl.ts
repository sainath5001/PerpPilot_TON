import type { PositionContext } from "./types";
import type { PositionSide } from "@/types/trading";

export interface PotentialPnLResult {
  /** Maximum loss at stop-loss (capped at collateral), or full collateral without SL */
  maximumLoss: number;
  /** Profit at take-profit, null if TP not provided */
  potentialProfit: number | null;
}

/**
 * Computes scenario PnL for stop-loss and take-profit levels.
 *
 * Long loss at SL:  `sizeBase × (entry - stopLoss)`
 * Short loss at SL: `sizeBase × (stopLoss - entry)`
 *
 * Long profit at TP:  `sizeBase × (takeProfit - entry)`
 * Short profit at TP: `sizeBase × (entry - takeProfit)`
 *
 * Losses are capped at posted collateral (isolated margin max loss).
 */
export function calculatePotentialPnL(
  context: PositionContext,
  stopLoss?: number,
  takeProfit?: number
): PotentialPnLResult {
  const { side, entryPrice, positionSizeBase, collateral } = context;

  let maximumLoss = collateral;

  if (stopLoss !== undefined && stopLoss > 0) {
    const rawLoss = calculateLossAtPrice(
      side,
      entryPrice,
      stopLoss,
      positionSizeBase
    );
    maximumLoss = Math.min(collateral, Math.max(0, rawLoss));
  }

  let potentialProfit: number | null = null;

  if (takeProfit !== undefined && takeProfit > 0) {
    const rawProfit = calculateProfitAtPrice(
      side,
      entryPrice,
      takeProfit,
      positionSizeBase
    );
    potentialProfit = Math.max(0, rawProfit);
  }

  return { maximumLoss, potentialProfit };
}

function calculateLossAtPrice(
  side: PositionSide,
  entryPrice: number,
  exitPrice: number,
  sizeBase: number
): number {
  if (side === "long") {
    return sizeBase * Math.max(0, entryPrice - exitPrice);
  }
  return sizeBase * Math.max(0, exitPrice - entryPrice);
}

function calculateProfitAtPrice(
  side: PositionSide,
  entryPrice: number,
  exitPrice: number,
  sizeBase: number
): number {
  if (side === "long") {
    return sizeBase * Math.max(0, exitPrice - entryPrice);
  }
  return sizeBase * Math.max(0, entryPrice - exitPrice);
}

/**
 * Risk-reward ratio (reward / risk).
 *
 * Formula: `riskRewardRatio = potentialProfit / maximumLoss`
 *
 * Returns null when profit or loss is zero/undefined, or TP not set.
 * Convention: 3.0 means $3 potential profit per $1 risked.
 */
export function calculateRiskReward(
  potentialProfit: number | null,
  maximumLoss: number
): number | null {
  if (potentialProfit === null || potentialProfit <= 0) return null;
  if (maximumLoss <= 0) return null;
  return potentialProfit / maximumLoss;
}
