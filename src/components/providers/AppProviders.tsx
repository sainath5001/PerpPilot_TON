"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const WalletProvider = dynamic(
  () =>
    import("@/components/wallet/WalletProvider").then(
      (mod) => mod.WalletProvider
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background">{/* hydration shell */}</div>
    ),
  }
);

export function AppProviders({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
