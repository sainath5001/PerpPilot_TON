import type {
  OrderSettlementParams,
  SettlementParams,
  SwapSettlementParams,
} from "@ston-fi/omniston-sdk";
import { DEFAULT_MAX_PRICE_SLIPPAGE_PIPS } from "./constants";

export function buildSwapOnlySettlementParams(
  maxPriceSlippagePips: number = DEFAULT_MAX_PRICE_SLIPPAGE_PIPS
): SettlementParams[] {
  return [
    {
      params: {
        $case: "swap",
        value: {
          maxPriceSlippagePips,
          flexibleIntegratorFee: true,
        } satisfies SwapSettlementParams,
      },
    },
  ];
}

export function buildSwapAndOrderSettlementParams(
  maxPriceSlippagePips: number = DEFAULT_MAX_PRICE_SLIPPAGE_PIPS
): SettlementParams[] {
  return [
    ...buildSwapOnlySettlementParams(maxPriceSlippagePips),
    {
      params: {
        $case: "order",
        value: {} satisfies OrderSettlementParams,
      },
    },
  ];
}
