import type { Quote, QuoteRequest, QuoteEventWithRfqId } from "@ston-fi/omniston-sdk";
import { isSwapQuote } from "@ston-fi/omniston-sdk";
import type { OmnistonAssetMeta } from "./assets";
import { buildSwapOnlySettlementParams } from "./settlement";
import { floatToUnits, pipsToPercent, unitsToFloat } from "./utils";
import { DEFAULT_MAX_PRICE_SLIPPAGE_PIPS } from "./constants";

export type RfqStreamEvent = QuoteEventWithRfqId;

export interface BuildQuoteRequestParams {
  inputAsset: OmnistonAssetMeta;
  outputAsset: OmnistonAssetMeta;
  inputAmount?: string;
  outputAmount?: string;
  slippagePips?: number;
}

export function buildQuoteRequest(
  params: BuildQuoteRequestParams
): QuoteRequest | null {
  const {
    inputAsset,
    outputAsset,
    inputAmount,
    outputAmount,
    slippagePips = DEFAULT_MAX_PRICE_SLIPPAGE_PIPS,
  } = params;

  let amount: QuoteRequest["amount"] | undefined;

  if (inputAmount && parseFloat(inputAmount) > 0) {
    amount = {
      $case: "inputUnits",
      value: floatToUnits(inputAmount, inputAsset.decimals).toString(),
    };
  } else if (outputAmount && parseFloat(outputAmount) > 0) {
    amount = {
      $case: "outputUnits",
      value: floatToUnits(outputAmount, outputAsset.decimals).toString(),
    };
  }

  if (!amount) return null;

  return {
    inputAsset: inputAsset.assetId,
    outputAsset: outputAsset.assetId,
    amount,
    settlementParams: buildSwapOnlySettlementParams(slippagePips),
  };
}

export interface ParsedQuoteMetrics {
  quoteId: string;
  rfqId: string;
  resolverName: string;
  inputSymbol: string;
  outputSymbol: string;
  inputAmount: number;
  outputAmount: number;
  protocolFee: number;
  integratorFee: number;
  totalFees: number;
  feePercent: number;
  minReceived: number;
  slippagePercent: number;
  priceImpactPercent: number;
  gasBudget: number | null;
  estimatedGas: number | null;
  settlementType: "swap" | "order";
  routeCount: number;
  stepCount: number;
  protocols: string[];
}

export function parseQuoteMetrics(
  quote: Quote,
  inputAsset: OmnistonAssetMeta,
  outputAsset: OmnistonAssetMeta,
  slippagePips: number = DEFAULT_MAX_PRICE_SLIPPAGE_PIPS
): ParsedQuoteMetrics {
  const inputAmount = unitsToFloat(quote.inputUnits, inputAsset.decimals);
  const outputAmount = unitsToFloat(quote.outputUnits, outputAsset.decimals);
  const protocolFee = unitsToFloat(quote.protocolFeeUnits, outputAsset.decimals);
  const integratorFee = unitsToFloat(
    quote.integratorFeeUnits,
    outputAsset.decimals
  );
  const totalFees = protocolFee + integratorFee;
  const feePercent = outputAmount > 0 ? (totalFees / outputAmount) * 100 : 0;

  const slippagePercent = pipsToPercent(slippagePips);
  const minReceived = outputAmount * (1 - slippagePercent / 100);
  const priceImpactPercent = Math.min(feePercent + slippagePercent * 0.5, 99);

  let routeCount = 0;
  let stepCount = 0;
  const protocols: string[] = [];

  if (isSwapQuote(quote)) {
    for (const route of quote.settlementData.value.routes) {
      routeCount++;
      for (const step of route.steps) {
        stepCount++;
        for (const chunk of step.chunks) {
          if (!protocols.includes(chunk.protocol)) {
            protocols.push(chunk.protocol);
          }
        }
      }
    }
  }

  return {
    quoteId: quote.quoteId,
    rfqId: quote.rfqId,
    resolverName: quote.resolverName,
    inputSymbol: inputAsset.symbol,
    outputSymbol: outputAsset.symbol,
    inputAmount,
    outputAmount,
    protocolFee,
    integratorFee,
    totalFees,
    feePercent,
    minReceived,
    slippagePercent,
    priceImpactPercent,
    gasBudget: quote.gasBudget
      ? unitsToFloat(quote.gasBudget, inputAsset.decimals)
      : null,
    estimatedGas: quote.estimatedGasConsumption
      ? unitsToFloat(quote.estimatedGasConsumption, inputAsset.decimals)
      : null,
    settlementType: quote.settlementData.$case,
    routeCount,
    stepCount,
    protocols,
  };
}

export function extractQuoteFromEvent(
  event: RfqStreamEvent | { $case: string; value?: unknown } | null | undefined
): Quote | null {
  if (event?.$case === "quoteUpdated" && event.value) {
    return event.value as Quote;
  }
  return null;
}
