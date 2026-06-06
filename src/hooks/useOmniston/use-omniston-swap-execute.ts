"use client";

import {
  isSwapQuote,
  matchQuoteByType,
  useOmniston,
  useSwapTrack,
  type ChainAddress,
  type Quote,
} from "@ston-fi/omniston-sdk-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback, useState } from "react";
import { SWAP_TX_VALID_UNTIL_SECONDS } from "@/lib/omniston/constants";
import { tonChainAddress } from "@/lib/omniston/assets";
import { hexToBase64 } from "@/lib/omniston/utils";

export type SwapExecutionPhase =
  | "idle"
  | "building"
  | "signing"
  | "tracking"
  | "completed"
  | "failed";

export interface SwapExecutionState {
  phase: SwapExecutionPhase;
  error: string | null;
  signedBoc: string | null;
  quoteId: string | null;
}

export function useOmnistonSwapExecute() {
  const omniston = useOmniston();
  const [tonConnectUI] = useTonConnectUI();
  const [state, setState] = useState<SwapExecutionState>({
    phase: "idle",
    error: null,
    signedBoc: null,
    quoteId: null,
  });

  const reset = useCallback(() => {
    setState({
      phase: "idle",
      error: null,
      signedBoc: null,
      quoteId: null,
    });
  }, []);

  const executeSwap = useCallback(
    async (quote: Quote, walletAddress: string) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      setState({
        phase: "building",
        error: null,
        signedBoc: null,
        quoteId: quote.quoteId,
      });

      try {
        const traderAddress: ChainAddress = tonChainAddress(walletAddress);

        const buildAndSend = matchQuoteByType(quote, {
          swap: async (swapQuote) => {
            if (!isSwapQuote(swapQuote)) {
              throw new Error("Expected swap quote");
            }

            setState((s) => ({ ...s, phase: "signing" }));

            const swapTx = await omniston.tonBuildSwap({
              quoteId: swapQuote.quoteId,
              transferSrcAddress: traderAddress,
              refundSrcAddress: traderAddress,
              gasExcessAddress: traderAddress,
              traderDstAddress: traderAddress,
              useRecommendedSlippage: true,
            });

            const { boc } = await tonConnectUI.sendTransaction({
              validUntil:
                Math.floor(Date.now() / 1000) + SWAP_TX_VALID_UNTIL_SECONDS,
              messages: swapTx.messages.map((message) => ({
                address: message.targetAddress,
                amount: message.sendAmount,
                payload: message.payload ? hexToBase64(message.payload) : undefined,
                stateInit: message.jettonWalletStateInit
                  ? hexToBase64(message.jettonWalletStateInit)
                  : undefined,
              })),
            });

            setState((s) => ({
              ...s,
              phase: "tracking",
              signedBoc: boc,
            }));

            return { quoteId: swapQuote.quoteId, signedBoc: boc, traderAddress };
          },
          order: async () => {
            throw new Error(
              "Order settlement is not enabled for collateral funding. Use swap-only mode."
            );
          },
        });

        const result = await buildAndSend;
        setState((s) => ({ ...s, phase: "tracking" }));
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Swap execution failed";
        setState({
          phase: "failed",
          error: message,
          signedBoc: null,
          quoteId: quote.quoteId,
        });
        throw err;
      }
    },
    [omniston, tonConnectUI]
  );

  const markCompleted = useCallback(() => {
    setState((s) => ({ ...s, phase: "completed" }));
  }, []);

  return { state, executeSwap, reset, markCompleted };
}

export function useOmnistonSwapTrack(params: {
  quoteId: string | null;
  traderAddress: string | null;
  signedBoc: string | null;
  enabled?: boolean;
}) {
  const traderChainAddress = params.traderAddress
    ? tonChainAddress(params.traderAddress)
    : null;

  return useSwapTrack(
    {
      quoteId: params.quoteId ?? "",
      traderAddress: traderChainAddress!,
      outgoingTxQuery: params.signedBoc ?? "",
    },
    {
      enabled:
        !!params.enabled &&
        !!params.quoteId &&
        !!traderChainAddress &&
        !!params.signedBoc,
    }
  );
}
