import {
  MAX_LEVERAGE,
  MIN_COLLATERAL,
  MIN_ENTRY_PRICE,
  MIN_LEVERAGE,
} from "./constants";
import type { RiskEngineInput } from "./types";

/**
 * Validates risk engine inputs and returns a list of human-readable errors.
 * Empty array means inputs are valid.
 */
export function validateRiskInput(input: RiskEngineInput): string[] {
  const errors: string[] = [];

  if (!input.asset || String(input.asset).trim().length === 0) {
    errors.push("Asset is required.");
  }

  if (input.side !== "long" && input.side !== "short") {
    errors.push("Direction must be 'long' or 'short'.");
  }

  if (!Number.isFinite(input.entryPrice) || input.entryPrice < MIN_ENTRY_PRICE) {
    errors.push(`Entry price must be a positive number (min ${MIN_ENTRY_PRICE}).`);
  }

  if (!Number.isFinite(input.collateral) || input.collateral < MIN_COLLATERAL) {
    errors.push(`Collateral must be at least ${MIN_COLLATERAL} USD.`);
  }

  if (
    !Number.isFinite(input.leverage) ||
    input.leverage < MIN_LEVERAGE ||
    input.leverage > MAX_LEVERAGE
  ) {
    errors.push(`Leverage must be between ${MIN_LEVERAGE}x and ${MAX_LEVERAGE}x.`);
  }

  const mark = input.markPrice ?? input.entryPrice;
  if (!Number.isFinite(mark) || mark < MIN_ENTRY_PRICE) {
    errors.push("Mark price must be a positive number.");
  }

  if (input.stopLoss !== undefined) {
    if (!Number.isFinite(input.stopLoss) || input.stopLoss <= 0) {
      errors.push("Stop loss must be a positive number when provided.");
    } else {
      validateStopLossPlacement(input, errors);
    }
  }

  if (input.takeProfit !== undefined) {
    if (!Number.isFinite(input.takeProfit) || input.takeProfit <= 0) {
      errors.push("Take profit must be a positive number when provided.");
    } else {
      validateTakeProfitPlacement(input, errors);
    }
  }

  return errors;
}

function validateStopLossPlacement(input: RiskEngineInput, errors: string[]): void {
  const { side, entryPrice, stopLoss } = input;
  if (stopLoss === undefined) return;

  if (side === "long" && stopLoss >= entryPrice) {
    errors.push("Long stop loss must be below entry price.");
  }

  if (side === "short" && stopLoss <= entryPrice) {
    errors.push("Short stop loss must be above entry price.");
  }
}

function validateTakeProfitPlacement(input: RiskEngineInput, errors: string[]): void {
  const { side, entryPrice, takeProfit } = input;
  if (takeProfit === undefined) return;

  if (side === "long" && takeProfit <= entryPrice) {
    errors.push("Long take profit must be above entry price.");
  }

  if (side === "short" && takeProfit >= entryPrice) {
    errors.push("Short take profit must be below entry price.");
  }
}

/**
 * Returns non-fatal warnings for edge-case placements (SL vs liquidation, etc.).
 */
export function collectRiskWarnings(
  input: RiskEngineInput,
  liquidationPrice: number
): string[] {
  const warnings: string[] = [];
  const { side, stopLoss, takeProfit, entryPrice } = input;

  if (stopLoss !== undefined) {
    if (side === "long" && stopLoss <= liquidationPrice) {
      warnings.push(
        "Stop loss is at or below estimated liquidation price — position may liquidate before stop triggers."
      );
    }
    if (side === "short" && stopLoss >= liquidationPrice) {
      warnings.push(
        "Stop loss is at or above estimated liquidation price — position may liquidate before stop triggers."
      );
    }
  } else {
    warnings.push(
      "No stop loss defined — maximum loss defaults to full collateral at liquidation."
    );
  }

  if (takeProfit === undefined) {
    warnings.push("No take profit defined — reward-to-risk ratio cannot be fully assessed.");
  }

  if (input.leverage >= 50) {
    warnings.push("High leverage (>50x) significantly increases liquidation risk.");
  }

  const liqDistancePct =
    side === "long"
      ? ((entryPrice - liquidationPrice) / entryPrice) * 100
      : ((liquidationPrice - entryPrice) / entryPrice) * 100;

  if (liqDistancePct < 2) {
    warnings.push("Liquidation price is within 2% of entry — extremely tight margin buffer.");
  }

  return warnings;
}

/**
 * Assert inputs are valid; throws with joined error messages if not.
 */
export function assertValidRiskInput(input: RiskEngineInput): void {
  const errors = validateRiskInput(input);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}
