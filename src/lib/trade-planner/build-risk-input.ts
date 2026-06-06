import type { RiskEngineInput } from "@/lib/risk-engine/types";
import type { TradePlannerFormValues } from "@/lib/trade-planner/schema";

function isFinitePositive(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

function isValidStopLoss(values: TradePlannerFormValues): boolean {
  if (values.stopLoss === undefined) return false;
  if (!isFinitePositive(values.stopLoss)) return false;
  if (values.side === "long") return values.stopLoss < values.entryPrice;
  return values.stopLoss > values.entryPrice;
}

function isValidTakeProfit(values: TradePlannerFormValues): boolean {
  if (values.takeProfit === undefined) return false;
  if (!isFinitePositive(values.takeProfit)) return false;
  if (values.side === "long") return values.takeProfit > values.entryPrice;
  return values.takeProfit < values.entryPrice;
}

/**
 * Returns true when minimum fields are present for live risk calculation.
 */
export function hasMinimumTradeInputs(values: TradePlannerFormValues): boolean {
  return (
    isFinitePositive(values.entryPrice) &&
    isFinitePositive(values.collateral) &&
    isFinitePositive(values.leverage) &&
    values.leverage <= 100
  );
}

/**
 * Builds a sanitized RiskEngineInput from form values.
 * Omits SL/TP when invalid or incomplete so live typing doesn't break analysis.
 */
export function buildRiskInputFromForm(
  values: TradePlannerFormValues
): RiskEngineInput | null {
  if (!hasMinimumTradeInputs(values)) return null;

  const input: RiskEngineInput = {
    asset: values.assetId,
    side: values.side,
    entryPrice: values.entryPrice,
    collateral: values.collateral,
    leverage: values.leverage,
  };

  if (isValidStopLoss(values)) {
    input.stopLoss = values.stopLoss;
  }

  if (isValidTakeProfit(values)) {
    input.takeProfit = values.takeProfit;
  }

  return input;
}
