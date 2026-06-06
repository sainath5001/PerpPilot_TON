"use client";

import { useWalletStore, selectIsWalletConnected } from "@/store/wallet-store";

export function useIsWalletConnected() {
  const isConnected = useWalletStore(selectIsWalletConnected);
  const isHydrated = useWalletStore((s) => s.isHydrated);
  return { isConnected, isHydrated, isReady: isHydrated };
}
