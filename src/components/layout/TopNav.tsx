"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard } from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsWalletConnected } from "@/hooks/use-is-wallet-connected";

const NAV_LINKS = [
  { href: "#platform-flow", label: "Platform Flow" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#omniston", label: "Omniston" },
];

export function TopNav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const { isConnected } = useIsWalletConnected();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/20">
            <Activity className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">PerpPilot</span>
              <Badge variant="secondary" className="text-[10px] uppercase">
                TON
              </Badge>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Perpetual Risk Terminal
            </p>
          </div>
        </Link>

        {!isDashboard && (
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {(isConnected || isDashboard) && (
            <Button
              variant={isDashboard ? "secondary" : "outline"}
              size="sm"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          <WalletConnectButton showNetwork />
        </div>
      </div>
    </header>
  );
}
