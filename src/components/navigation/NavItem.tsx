"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface NavItemLinkProps {
  item: NavItem;
  collapsed?: boolean;
}

export function NavItemLink({ item, collapsed = false }: NavItemLinkProps) {
  const pathname = usePathname();
  const isHashLink = item.href.includes("#");
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isActive = isHashLink
    ? pathname === item.href.split("#")[0] &&
      hash === `#${item.href.split("#")[1]}`
    : pathname === item.href;

  const content = (
    <>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-base",
          isActive
            ? "bg-primary/15 text-primary"
            : "bg-muted/50 text-muted-foreground group-hover:text-foreground"
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </>
  );

  const className = cn(
    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    item.disabled
      ? "cursor-not-allowed opacity-40"
      : isActive
        ? "bg-accent text-foreground"
        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
  );

  if (item.disabled) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}
