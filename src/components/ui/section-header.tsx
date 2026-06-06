import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  badge,
  title,
  description,
  action,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:items-center sm:justify-center",
        className
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        {badge && (
          <Badge variant="secondary" className="mb-3 text-[10px] uppercase tracking-widest">
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 text-muted-foreground sm:text-lg">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
