"use client";

import { useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useWalletStore } from "@/store/wallet-store";

export function useWalletSync() {
  const tonWallet = useTonWallet();
  const setWallet = useWalletStore((s) => s.setWallet);
  const setHydrated = useWalletStore((s) => s.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  useEffect(() => {
    if (!tonWallet?.account?.address) {
      setWallet(null);
      return;
    }

    setWallet({
      address: tonWallet.account.address,
      rawAddress: tonWallet.account.address,
      walletName: tonWallet.device.appName ?? "TON Wallet",
      walletId: tonWallet.device.appName ?? "tonconnect",
      network: tonWallet.account.chain === "-3" ? "testnet" : "mainnet",
    });
  }, [tonWallet, setWallet]);
}
