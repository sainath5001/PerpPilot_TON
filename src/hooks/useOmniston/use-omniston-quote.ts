"use client";

import {
  useConnectionStatus,
  useRfq,
  type QuoteRequest,
} from "@ston-fi/omniston-sdk-react";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { OMNISTON_QUOTE_DEBOUNCE_MS } from "@/lib/omniston/constants";
import {
  extractQuoteFromEvent,
  parseQuoteMetrics,
  type ParsedQuoteMetrics,
} from "@/lib/omniston/quote-parser";
import type { OmnistonAssetMeta } from "@/lib/omniston/assets";
import { DEFAULT_MAX_PRICE_SLIPPAGE_PIPS } from "@/lib/omniston/constants";

export interface UseOmnistonQuoteResult {
  quoteEvent: ReturnType<typeof useRfq>["data"];
  quote: ReturnType<typeof extractQuoteFromEvent>;
  metrics: ParsedQuoteMetrics | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  isNoQuote: boolean;
  connectionStatus: ReturnType<typeof useConnectionStatus>;
  rfqId: string | null;
}

export function useOmnistonQuote(
  request: QuoteRequest | null,
  inputAsset: OmnistonAssetMeta,
  outputAsset: OmnistonAssetMeta,
  options?: { enabled?: boolean; slippagePips?: number }
): UseOmnistonQuoteResult {
  const debouncedRequest = useDebounce(request, OMNISTON_QUOTE_DEBOUNCE_MS);
  const enabled = options?.enabled !== false && debouncedRequest !== null;
  const slippagePips =
    options?.slippagePips ?? DEFAULT_MAX_PRICE_SLIPPAGE_PIPS;

  const connectionStatus = useConnectionStatus();

  const {
    data: quoteEvent,
    isLoading,
    isFetching,
    isError,
    error,
  } = useRfq(debouncedRequest!, {
    enabled,
  });

  const quote = useMemo(
    () => extractQuoteFromEvent(quoteEvent ?? undefined),
    [quoteEvent]
  );

  const metrics = useMemo(() => {
    if (!quote) return null;
    return parseQuoteMetrics(quote, inputAsset, outputAsset, slippagePips);
  }, [quote, inputAsset, outputAsset, slippagePips]);

  const isNoQuote = quoteEvent?.$case === "noQuote";
  const rfqId =
    quoteEvent?.$case === "ack"
      ? quoteEvent.value.rfqId
      : quoteEvent && "rfqId" in quoteEvent
        ? (quoteEvent as { rfqId: string }).rfqId
        : null;

  return {
    quoteEvent,
    quote,
    metrics,
    isLoading: enabled && (isLoading || isFetching) && !quote,
    isFetching,
    isError,
    error: error ?? null,
    isNoQuote,
    connectionStatus,
    rfqId,
  };
}
