"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavItemLink } from "@/components/navigation/NavItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

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
          Navigation
        </p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavItemLink key={item.id} item={item} />
        ))}
      </nav>
      <Separator className="mx-4" />
      <div className="p-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground">Coming soon</p>
          <p className="mt-1 text-sm font-semibold">Omniston Collateral</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cross-chain collateral management via STON.fi Omniston SDK.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 lg:hidden"
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
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4 lg:hidden">
          <span className="font-semibold">Menu</span>
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
