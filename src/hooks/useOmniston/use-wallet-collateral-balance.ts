"use client";

import { Address } from "@ton/core";
import { useMemo } from "react";
import { useBalance, useJettons } from "@ton/appkit-react";
import {
  DEFAULT_COLLATERAL_ASSET,
  TON_USDC_JETTON,
  TON_USDT_JETTON,
} from "@/lib/omniston/assets";
import { useWalletStore } from "@/store/wallet-store";

export interface CollateralBalances {
  ton: number;
  usdt: number;
  usdc: number;
  collateralUsd: number;
  isLoading: boolean;
  isConnected: boolean;
}

function sameTonAddress(a: string, b: string): boolean {
  try {
    return Address.parse(a).equals(Address.parse(b));
  } catch {
    return a === b;
  }
}

function parseBalance(value: string | undefined): number {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useWalletCollateralBalance(): CollateralBalances {
  const wallet = useWalletStore((s) => s.wallet);
  const isConnected = wallet !== null;

  const { data: tonBalance, isLoading: tonLoading } = useBalance({
    query: { enabled: isConnected },
  });

  const { data: jettons, isLoading: jettonLoading } = useJettons({
    query: { enabled: isConnected },
  });

  return useMemo(() => {
    if (!isConnected) {
      return {
        ton: 0,
        usdt: 0,
        usdc: 0,
        collateralUsd: 0,
        isLoading: false,
        isConnected: false,
      };
    }

    const ton = parseBalance(tonBalance);

    let usdt = 0;
    let usdc = 0;

    for (const item of jettons?.jettons ?? []) {
      const balance = parseBalance(item.balance);
      if (sameTonAddress(item.address, TON_USDT_JETTON)) {
        usdt = balance;
      }
      if (sameTonAddress(item.address, TON_USDC_JETTON)) {
        usdc = balance;
      }
    }

    const collateralUsd = usdt + usdc;

    return {
      ton,
      usdt,
      usdc,
      collateralUsd,
      isLoading: tonLoading || jettonLoading,
      isConnected: true,
    };
  }, [isConnected, tonBalance, jettons, tonLoading, jettonLoading]);
}

export function useCollateralShortfall(requiredUsd: number): {
  shortfall: number;
  isFunded: boolean;
  collateralAsset: typeof DEFAULT_COLLATERAL_ASSET;
} {
  const balances = useWalletCollateralBalance();
  const shortfall = Math.max(0, requiredUsd - balances.collateralUsd);

  return {
    shortfall,
    isFunded: shortfall <= 0 && requiredUsd > 0,
    collateralAsset: DEFAULT_COLLATERAL_ASSET,
  };
}
