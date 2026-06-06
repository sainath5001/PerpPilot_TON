"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppKitProvider } from "@ton/appkit-react";
import { useState, type ReactNode } from "react";
import "@ton/appkit-react/styles.css";
import { createAppKit } from "@/lib/appkit";
import { useWalletSync } from "@/hooks/use-wallet-sync";

function WalletSyncBridge() {
  useWalletSync();
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [appKit] = useState(() => createAppKit());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <AppKitProvider appKit={appKit}>
      <QueryClientProvider client={queryClient}>
        <WalletSyncBridge />
        {children}
      </QueryClientProvider>
    </AppKitProvider>
  );
}
