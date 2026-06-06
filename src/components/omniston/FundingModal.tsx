"use client";

import { ArrowRightLeft } from "lucide-react";
import { FundingPanel } from "@/components/omniston/FundingPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCollateralShortfall } from "@/hooks/useOmniston";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface FundingModalProps {
  requiredCollateralUsd: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerLabel?: string;
  className?: string;
}

export function FundingModal({
  requiredCollateralUsd,
  open,
  onOpenChange,
  triggerLabel = "Fund Collateral",
  className,
}: FundingModalProps) {
  const { shortfall, isFunded } = useCollateralShortfall(requiredCollateralUsd);
  const showTrigger = shortfall > 0 && requiredCollateralUsd > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="trading" size="sm" className={className}>
            <ArrowRightLeft className="h-4 w-4" />
            {triggerLabel}
            <span className="ml-1 font-mono text-xs opacity-80">
              ({formatUsd(shortfall)})
            </span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className={cn("max-h-[90vh] max-w-xl overflow-y-auto sm:max-w-xl", className)}>
        <DialogHeader>
          <DialogTitle>Fund Collateral via Omniston</DialogTitle>
          <DialogDescription>
            Swap TON for USDT using STON.fi&apos;s best route before entering your perpetual position.
          </DialogDescription>
        </DialogHeader>

        <FundingPanel
          requiredCollateralUsd={requiredCollateralUsd}
          onFunded={() => onOpenChange?.(false)}
        />

        {isFunded && (
          <p className="text-center text-xs text-emerald-400">
            Your wallet meets the collateral requirement.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
