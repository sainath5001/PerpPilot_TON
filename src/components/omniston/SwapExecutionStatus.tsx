"use client";

import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { TradeStatus } from "@ston-fi/omniston-sdk";
import { Badge } from "@/components/ui/badge";
import type { SwapExecutionPhase } from "@/hooks/useOmniston";
import { cn } from "@/lib/utils";

interface SwapExecutionStatusProps {
  phase: SwapExecutionPhase;
  trackStatus?: string;
  error?: string | null;
  txHash?: string | null;
  className?: string;
}

const PHASE_STEPS: { id: SwapExecutionPhase; label: string }[] = [
  { id: "building", label: "Build TX" },
  { id: "signing", label: "Sign" },
  { id: "tracking", label: "Track" },
  { id: "completed", label: "Done" },
];

function phaseIndex(phase: SwapExecutionPhase): number {
  if (phase === "idle") return -1;
  if (phase === "failed") return 3;
  return PHASE_STEPS.findIndex((s) => s.id === phase);
}

function formatTradeStatus(status: string): string {
  switch (status) {
    case TradeStatus.TRADE_STATUS_IN_PROGRESS:
      return "In Progress";
    case TradeStatus.TRADE_STATUS_FULLY_FILLED:
      return "Completed";
    case TradeStatus.TRADE_STATUS_PARTIALLY_FILLED:
      return "Partially Filled";
    case TradeStatus.TRADE_STATUS_CANCELLED:
      return "Cancelled";
    case TradeStatus.TRADE_STATUS_FAILED:
      return "Failed";
    default:
      return status.replace("TRADE_STATUS_", "").replace(/_/g, " ").toLowerCase();
  }
}

export function SwapExecutionStatus({
  phase,
  trackStatus,
  error,
  txHash,
  className,
}: SwapExecutionStatusProps) {
  if (phase === "idle") return null;

  const current = phaseIndex(phase);
  const isFailed = phase === "failed";

  return (
    <div className={cn("space-y-3 rounded-xl border border-border bg-card/40 p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Transaction Status</p>
        {trackStatus && (
          <Badge
            variant={
              trackStatus === TradeStatus.TRADE_STATUS_FULLY_FILLED
                ? "success"
                : trackStatus === TradeStatus.TRADE_STATUS_FAILED
                  ? "danger"
                  : "warning"
            }
            className="text-[10px]"
          >
            {formatTradeStatus(trackStatus)}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {PHASE_STEPS.map((step, index) => {
          const done = !isFailed && current > index;
          const active = !isFailed && current === index;
          const failed = isFailed && index === current;

          return (
            <div key={step.id} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border",
                  done && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                  active && "border-cyan-500/50 bg-cyan-500/10 text-cyan-400",
                  failed && "border-red-500/50 bg-red-500/10 text-red-400",
                  !done && !active && !failed && "border-border text-muted-foreground"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : failed ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{step.label}</span>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {txHash && (
        <p className="truncate font-mono text-[10px] text-muted-foreground">
          TX: {txHash}
        </p>
      )}
    </div>
  );
}
