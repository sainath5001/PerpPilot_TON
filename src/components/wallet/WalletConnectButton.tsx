"use client";

import { useTonConnectUI } from "@tonconnect/ui-react";
import { LogOut, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsWalletConnected } from "@/hooks/use-is-wallet-connected";
import { useWalletStore } from "@/store/wallet-store";
import { cn, truncateAddress } from "@/lib/utils";

interface WalletConnectButtonProps {
  className?: string;
  variant?: "default" | "trading" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showNetwork?: boolean;
}

export function WalletConnectButton({
  className,
  variant = "trading",
  size = "default",
  showNetwork = false,
}: WalletConnectButtonProps) {
  const [tonConnectUI] = useTonConnectUI();
  const { isConnected, isReady } = useIsWalletConnected();
  const wallet = useWalletStore((s) => s.wallet);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const unsub = tonConnectUI.onStatusChange(() => {
      setIsPending(false);
    });
    return unsub;
  }, [tonConnectUI]);

  const handleConnect = useCallback(async () => {
    setIsPending(true);
    try {
      await tonConnectUI.openModal();
    } finally {
      setIsPending(false);
    }
  }, [tonConnectUI]);

  const handleDisconnect = useCallback(async () => {
    await tonConnectUI.disconnect();
  }, [tonConnectUI]);

  if (!isReady) {
    return <Skeleton className={cn("h-10 w-36 rounded-md", className)} />;
  }

  if (isConnected && wallet) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showNetwork && (
          <span className="hidden rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 sm:inline-block">
            TON Mainnet
          </span>
        )}
        <div className="flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs text-muted-foreground">{wallet.walletName}</p>
            <p className="font-mono text-sm font-medium">
              {truncateAddress(wallet.address, 4)}
            </p>
          </div>
          <span className="font-mono text-sm font-medium sm:hidden">
            {truncateAddress(wallet.address, 3)}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDisconnect}
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleConnect}
      disabled={isPending}
    >
      <Wallet className="h-4 w-4" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
