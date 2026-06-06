"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsWalletConnected } from "@/hooks/use-is-wallet-connected";
import type { NavItem } from "@/types";
import { DASHBOARD_NAV } from "@/lib/config";

const dashboardNavItems: NavItem[] = [...DASHBOARD_NAV];

interface ProtectedDashboardLayoutProps {
  children: React.ReactNode;
}

export function ProtectedDashboardLayout({
  children,
}: ProtectedDashboardLayoutProps) {
  const router = useRouter();
  const { isConnected, isReady } = useIsWalletConnected();

  useEffect(() => {
    if (isReady && !isConnected) {
      router.replace("/?auth=required");
    }
  }, [isConnected, isReady, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TopNav />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TopNav />
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Redirecting to connect wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={dashboardNavItems} />
        <main className="flex-1 overflow-y-auto">
          <div className="h-full w-full p-3 lg:p-4 xl:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
