"use client";

import { useCallback, useEffect } from "react";
import {
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { RouteDetails } from "@/components/omniston/RouteDetails";
import { SwapExecutionStatus } from "@/components/omniston/SwapExecutionStatus";
import { SwapQuotePreview } from "@/components/omniston/SwapQuotePreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCollateralFunding,
  useOmnistonConnection,
  useOmnistonSwapExecute,
  useOmnistonSwapTrack,
  useWalletCollateralBalance,
} from "@/hooks/useOmniston";
import { TradeStatus } from "@ston-fi/omniston-sdk";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";

interface FundingPanelProps {
  requiredCollateralUsd: number;
  enabled?: boolean;
  className?: string;
  onFunded?: () => void;
}

export function FundingPanel({
  requiredCollateralUsd,
  enabled = true,
  className,
  onFunded,
}: FundingPanelProps) {
  const wallet = useWalletStore((s) => s.wallet);
  const balances = useWalletCollateralBalance();
  const connection = useOmnistonConnection();

  const funding = useCollateralFunding({
    requiredCollateralUsd,
    enabled: enabled && requiredCollateralUsd > 0 && !!wallet,
  });

  const { state, executeSwap, reset, markCompleted } = useOmnistonSwapExecute();

  const trackQuery = useOmnistonSwapTrack({
    quoteId: state.quoteId,
    traderAddress: wallet?.address ?? null,
    signedBoc: state.signedBoc,
    enabled: state.phase === "tracking",
  });

  const trackEvent = trackQuery.data;
  const trackProgress =
    trackEvent?.$case === "progress" ? trackEvent.value : null;
  const trackStatus = trackProgress?.status;

  useEffect(() => {
    if (trackStatus === TradeStatus.TRADE_STATUS_FULLY_FILLED) {
      markCompleted();
      onFunded?.();
    }
  }, [trackStatus, markCompleted, onFunded]);

  const handleExecute = useCallback(async () => {
    if (!funding.quote || !wallet?.address) return;
    reset();
    await executeSwap(funding.quote, wallet.address);
  }, [funding.quote, wallet?.address, executeSwap, reset]);

  const isExecuting = ["building", "signing", "tracking"].includes(state.phase);
  const showFunding = requiredCollateralUsd > 0 && !funding.isFunded;

  if (!wallet) {
    return (
      <Card className={cn("border-border/80 bg-card/40", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Collateral Funding</CardTitle>
          <CardDescription>
            Connect your wallet to check collateral and fund via Omniston.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Wallet not connected
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/80 bg-card/40", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRightLeft className="h-4 w-4 text-cyan-400" />
              Collateral Funding
            </CardTitle>
            <CardDescription>
              Acquire {funding.outputAsset.symbol} via STON.fi Omniston before opening a position
            </CardDescription>
          </div>
          <ConnectionBadge status={connection.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <BalanceTile label="Required" value={formatUsd(requiredCollateralUsd)} />
          <BalanceTile
            label={`${funding.collateralAsset.symbol} Balance`}
            value={formatUsd(balances.collateralUsd)}
            loading={balances.isLoading}
          />
          <BalanceTile
            label="Shortfall"
            value={formatUsd(funding.shortfall)}
            highlight={funding.shortfall > 0}
            success={funding.isFunded}
          />
        </div>

        {funding.isFunded && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Collateral requirement met — ready to proceed with your trade plan.
          </div>
        )}

        {showFunding && (
          <>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="font-mono">
                {funding.inputAsset.symbol} → {funding.outputAsset.symbol}
              </Badge>
              <span>Best route via Omniston RFQ</span>
            </div>

            <SwapQuotePreview
              inputAsset={funding.inputAsset}
              outputAsset={funding.outputAsset}
              metrics={funding.metrics}
              isLoading={funding.isLoading}
              isNoQuote={funding.isNoQuote}
              error={
                funding.isError
                  ? funding.error?.message ?? "Failed to fetch quote"
                  : null
              }
            />

            {funding.quote && funding.metrics && (
              <RouteDetails
                quote={funding.quote}
                inputAsset={funding.inputAsset}
                outputAsset={funding.outputAsset}
              />
            )}

            <SwapExecutionStatus
              phase={state.phase}
              trackStatus={trackStatus}
              error={state.error}
              txHash={trackProgress?.outgoingTxHash}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="trading"
                className="flex-1 sm:flex-none"
                disabled={
                  !funding.quote ||
                  funding.isLoading ||
                  isExecuting ||
                  !connection.isReady
                }
                onClick={() => void handleExecute()}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>Swap via Omniston</>
                )}
              </Button>

              {state.phase === "failed" && (
                <Button variant="outline" onClick={reset}>
                  Retry
                </Button>
              )}
            </div>

            {!connection.isReady && (
              <div className="flex items-start gap-2 text-xs text-amber-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Omniston connection is {connection.status}. Quotes may be delayed.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BalanceTile({
  label,
  value,
  loading,
  highlight,
  success,
}: {
  label: string;
  value: string;
  loading?: boolean;
  highlight?: boolean;
  success?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-mono text-sm font-semibold tabular-nums",
          highlight && "text-amber-400",
          success && "text-emerald-400"
        )}
      >
        {loading ? "…" : value}
      </p>
    </div>
  );
}

function ConnectionBadge({ status }: { status: string }) {
  const variant =
    status === "connected"
      ? "success"
      : status === "connecting"
        ? "warning"
        : status === "error"
          ? "danger"
          : "outline";

  return (
    <Badge variant={variant} className="text-[10px] uppercase">
      Omniston · {status}
    </Badge>
  );
}
