"use client";

import { useEffect } from "react";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useWalletStore } from "@/store/wallet-store";

export function useWalletSync() {
  const address = useTonAddress();
  const rawAddress = useTonAddress(false);
  const tonWallet = useTonWallet();
  const setWallet = useWalletStore((s) => s.setWallet);
  const setHydrated = useWalletStore((s) => s.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  useEffect(() => {
    if (address && tonWallet) {
      setWallet({
        address,
        rawAddress: rawAddress || address,
        walletName: tonWallet.device.appName ?? "TON Wallet",
        walletId: tonWallet.device.appName ?? "ton-wallet",
        network: "mainnet",
      });
      return;
    }

    setWallet(null);
  }, [address, rawAddress, tonWallet, setWallet]);
}
