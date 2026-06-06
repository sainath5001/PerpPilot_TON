"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { Badge } from "@/components/ui/badge";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/20">
            <Activity className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                PerpPilot
              </span>
              <Badge variant="secondary" className="text-[10px] uppercase">
                TON
              </Badge>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Perpetual Risk Terminal
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <WalletConnectButton showNetwork />
        </div>
      </div>
    </header>
  );
}
