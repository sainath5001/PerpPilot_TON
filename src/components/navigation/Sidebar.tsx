"use client";

import { ArrowRightLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavItemLink } from "@/components/navigation/NavItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

export function Sidebar({ items, className }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Terminal
        </p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavItemLink key={item.id} item={item} />
        ))}
      </nav>
      <Separator className="mx-4" />
      <div className="p-4">
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] to-cyan-500/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-emerald-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Omniston Live
            </p>
          </div>
          <p className="text-sm font-medium">Collateral Funding</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Swap TON → USDT via STON.fi best route. Scroll to the funding panel below your trade plan.
          </p>
          <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
            <Link href="/dashboard#funding" onClick={() => setMobileOpen(false)}>
              <Sparkles className="h-3.5 w-3.5" />
              Go to Funding
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 shadow-lg lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border/60 bg-card/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4 lg:hidden">
          <span className="font-semibold">Navigation</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
