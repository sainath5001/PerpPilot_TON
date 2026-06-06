"use client";

import { useMemo } from "react";
import type { QuoteRequest } from "@ston-fi/omniston-sdk";
import {
  DEFAULT_COLLATERAL_ASSET,
  DEFAULT_INPUT_ASSET,
  getOmnistonAsset,
  type OmnistonAssetMeta,
} from "@/lib/omniston/assets";
import { buildQuoteRequest } from "@/lib/omniston/quote-parser";
import { useCollateralShortfall } from "./use-wallet-collateral-balance";
import { useOmnistonQuote } from "./use-omniston-quote";

export interface FundingParams {
  requiredCollateralUsd: number;
  inputAssetId?: string;
  outputAssetId?: string;
  inputAmount?: string;
  outputAmount?: string;
  enabled?: boolean;
}

export function useCollateralFunding({
  requiredCollateralUsd,
  inputAssetId = DEFAULT_INPUT_ASSET.id,
  outputAssetId = DEFAULT_COLLATERAL_ASSET.id,
  inputAmount,
  outputAmount,
  enabled = true,
}: FundingParams) {
  const { shortfall, isFunded, collateralAsset } =
    useCollateralShortfall(requiredCollateralUsd);

  const inputAsset =
    getOmnistonAsset(inputAssetId) ?? DEFAULT_INPUT_ASSET;
  const outputAsset =
    getOmnistonAsset(outputAssetId) ?? DEFAULT_COLLATERAL_ASSET;

  const effectiveOutputAmount =
    outputAmount ??
    (shortfall > 0 ? shortfall.toFixed(2) : undefined);

  const quoteRequest = useMemo((): QuoteRequest | null => {
    if (!enabled) return null;
    if (!inputAmount && !effectiveOutputAmount) return null;

    return buildQuoteRequest({
      inputAsset: inputAsset as OmnistonAssetMeta,
      outputAsset: outputAsset as OmnistonAssetMeta,
      inputAmount,
      outputAmount: effectiveOutputAmount,
    });
  }, [
    enabled,
    inputAsset,
    outputAsset,
    inputAmount,
    effectiveOutputAmount,
  ]);

  const quote = useOmnistonQuote(
    quoteRequest,
    inputAsset,
    outputAsset,
    { enabled: enabled && !isFunded }
  );

  return {
    shortfall,
    isFunded,
    collateralAsset,
    inputAsset,
    outputAsset,
    quoteRequest,
    ...quote,
  };
}
