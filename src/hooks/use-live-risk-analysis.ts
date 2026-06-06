import { useMemo } from "react";
import { analyzePosition, type RiskMetrics } from "@/lib/risk-engine";
import { buildRiskInputFromForm } from "@/lib/trade-planner/build-risk-input";
import type { TradePlannerFormValues } from "@/lib/trade-planner/schema";

export interface LiveRiskAnalysis {
  metrics: RiskMetrics | null;
  errors: string[];
  isReady: boolean;
}

/**
 * Computes risk metrics in real time as trade planner form values change.
 * All calculations are client-side with no API calls.
 */
export function useLiveRiskAnalysis(
  values: TradePlannerFormValues
): LiveRiskAnalysis {
  return useMemo(() => {
    const input = buildRiskInputFromForm(values);

    if (!input) {
      return { metrics: null, errors: [], isReady: false };
    }

    const result = analyzePosition(input);

    if (!result.success) {
      return { metrics: null, errors: result.errors, isReady: true };
    }

    return { metrics: result.metrics, errors: [], isReady: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular form field subscription
  }, [
    values.assetId,
    values.side,
    values.entryPrice,
    values.collateral,
    values.leverage,
    values.stopLoss,
    values.takeProfit,
  ]);
}
