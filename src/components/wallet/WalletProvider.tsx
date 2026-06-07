"use client";

import { OmnistonProvider } from "@ston-fi/omniston-sdk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppKitProvider } from "@ton/appkit-react";
import { useState, type ReactNode } from "react";
import "@ton/appkit-react/styles.css";
import { getAppKit } from "@/lib/tonconnect/client";
import { useWalletSync } from "@/hooks/use-wallet-sync";
import { getOmnistonClient } from "@/lib/omniston/client";

function WalletSyncBridge() {
  useWalletSync();
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [appKit] = useState(() => getAppKit());
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

  const omniston = getOmnistonClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppKitProvider appKit={appKit}>
        <OmnistonProvider omniston={omniston}>
          <WalletSyncBridge />
          {children}
        </OmnistonProvider>
      </AppKitProvider>
    </QueryClientProvider>
  );
}
