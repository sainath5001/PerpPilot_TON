"use client";

import { Loader2 } from "lucide-react";
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

function DashboardLoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-72 border-r border-border/60 bg-card/40 lg:block">
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[420px] w-full rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
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
    return <DashboardLoadingSkeleton />;
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TopNav />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          <p className="text-sm text-muted-foreground">
            Redirecting to wallet connection…
          </p>
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
          <div className="mx-auto h-full w-full max-w-[1600px] p-3 lg:p-4 xl:p-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
