"use client";

import { useTonConnectUI } from "@tonconnect/ui-react";
import { useWalletStore, selectIsWalletConnected } from "@/store/wallet-store";

export function useIsWalletConnected() {
  const isConnected = useWalletStore(selectIsWalletConnected);
  const isHydrated = useWalletStore((s) => s.isHydrated);
  const [tonConnectUI] = useTonConnectUI();

  return {
    isConnected,
    isHydrated,
    isReady: isHydrated && Boolean(tonConnectUI),
  };
}
