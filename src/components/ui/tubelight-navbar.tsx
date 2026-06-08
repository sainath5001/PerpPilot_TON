"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TubelightNavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface TubelightNavBarProps {
  items: TubelightNavItem[];
  className?: string;
  /** fixed = floating pill (landing). inline = centered inside header row */
  variant?: "fixed" | "inline";
  activeName?: string;
  onActiveChange?: (name: string) => void;
}

export function TubelightNavBar({
  items,
  className,
  variant = "fixed",
  activeName,
  onActiveChange,
}: TubelightNavBarProps) {
  const [internalActive, setInternalActive] = useState(items[0]?.name ?? "");
  const activeTab = activeName ?? internalActive;

  const setActive = (name: string) => {
    if (!activeName) setInternalActive(name);
    onActiveChange?.(name);
  };

  useEffect(() => {
    if (activeName) return;

    const syncFromLocation = () => {
      const { pathname, hash } = window.location;

      if (pathname.startsWith("/dashboard")) {
        const dash = items.find((i) => i.url === "/dashboard");
        if (dash) setInternalActive(dash.name);
        return;
      }

      if (hash) {
        const match = items.find((item) => item.url === hash);
        if (match) {
          setInternalActive(match.name);
          return;
        }
      }

      const home = items.find((i) => i.url === "/");
      if (home) setInternalActive(home.name);
    };

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    return () => window.removeEventListener("hashchange", syncFromLocation);
  }, [activeName, items]);

  return (
    <div
      className={cn(
        variant === "fixed" &&
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 sm:bottom-auto sm:top-6",
        variant === "inline" && "relative",
        className
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-1 py-1 shadow-lg shadow-emerald-500/5 backdrop-blur-lg sm:gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActive(item.name)}
              className={cn(
                "relative cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5",
                "text-muted-foreground hover:text-emerald-400",
                isActive && "text-emerald-400"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="tubelight-lamp"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-emerald-500/10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-emerald-400">
                    <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-emerald-400/25 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-emerald-400/20 blur-md" />
                    <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-emerald-400/30 blur-sm" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
