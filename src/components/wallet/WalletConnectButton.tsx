"use client";

import { useTonConnectUI } from "@tonconnect/ui-react";
import { LogOut, Wallet } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsWalletConnected } from "@/hooks/use-is-wallet-connected";
import { isTonConnectAbortError } from "@/lib/tonconnect/client";
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
  const { isConnected, isReady } = useIsWalletConnected();
  const wallet = useWalletStore((s) => s.wallet);
  const [tonConnectUI] = useTonConnectUI();
  const connectingRef = useRef(false);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    if (connectingRef.current) return;

    connectingRef.current = true;
    setIsOpening(true);
    setError(null);

    try {
      await tonConnectUI.connectionRestored;
      await tonConnectUI.openModal();
    } catch (err) {
      if (!isTonConnectAbortError(err)) {
        const message =
          err instanceof Error ? err.message : "Could not open wallet modal";
        setError(message);
        console.error("[PerpPilot] connect error:", err);
      }
    } finally {
      connectingRef.current = false;
      setIsOpening(false);
    }
  }, [tonConnectUI]);

  const handleDisconnect = useCallback(async () => {
    try {
      await tonConnectUI.disconnect();
    } catch (err) {
      console.error("[PerpPilot] disconnect error:", err);
    }
  }, [tonConnectUI]);

  if (!isReady) {
    return <Skeleton className={cn("h-10 w-36 rounded-md", className)} />;
  }

  if (isConnected && wallet) {
    return (
      <div className={cn("flex flex-col items-end gap-1", className)}>
        <div className="flex items-center gap-2">
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
            onClick={() => void handleDisconnect()}
            aria-label="Disconnect wallet"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <Button
        variant={variant}
        size={size}
        onClick={() => void handleConnect()}
        disabled={isOpening}
      >
        <Wallet className="h-4 w-4" />
        {isOpening ? "Opening…" : "Connect Wallet"}
      </Button>
      {error && (
        <p className="max-w-xs text-right text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}
