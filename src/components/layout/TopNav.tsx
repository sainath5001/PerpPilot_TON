"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRightLeft,
  Home,
  LayoutDashboard,
  Orbit,
  Workflow,
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TubelightNavBar,
  type TubelightNavItem,
} from "@/components/ui/tubelight-navbar";
import { useIsWalletConnected } from "@/hooks/use-is-wallet-connected";

const LANDING_NAV: TubelightNavItem[] = [
  { name: "Home", url: "/", icon: Home },
  { name: "Platform", url: "#platform-flow", icon: Orbit },
  { name: "How It Works", url: "#how-it-works", icon: Workflow },
  { name: "Reviews", url: "#testimonials", icon: ArrowRightLeft },
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const DASHBOARD_NAV: TubelightNavItem[] = [
  { name: "Home", url: "/", icon: Home },
  { name: "Terminal", url: "/dashboard", icon: LayoutDashboard },
];

export function TopNav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const { isConnected } = useIsWalletConnected();

  const navItems = isDashboard ? DASHBOARD_NAV : LANDING_NAV;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
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

          {/* Desktop: tubelight inline in header */}
          <div className="hidden flex-1 justify-center lg:flex">
            <TubelightNavBar items={navItems} variant="inline" />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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

      {/* Mobile + tablet: floating tubelight at bottom / top */}
      <div className="lg:hidden">
        <TubelightNavBar items={navItems} variant="fixed" />
      </div>
    </>
  );
}
