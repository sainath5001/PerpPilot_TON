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
          "flex h-6 w-6 shrink-0 items-center justify-center rounded text-sm",
          isActive
            ? "bg-primary/15 text-primary"
            : "bg-muted/50 text-muted-foreground group-hover:text-foreground"
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
          <span className="truncate text-xs">{item.label}</span>
          {item.badge && (
            <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-primary">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </>
  );

  const className = cn(
    "group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
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
