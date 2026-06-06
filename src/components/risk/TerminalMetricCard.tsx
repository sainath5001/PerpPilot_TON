import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TerminalMetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
  description?: string;
}

const variantStyles = {
  default: "border-border/80 bg-card/60",
  success: "border-emerald-500/20 bg-emerald-500/5",
  danger: "border-red-500/20 bg-red-500/5",
  warning: "border-amber-500/20 bg-amber-500/5",
  info: "border-cyan-500/20 bg-cyan-500/5",
};

const valueStyles = {
  default: "text-foreground",
  success: "text-emerald-400",
  danger: "text-red-400",
  warning: "text-amber-400",
  info: "text-cyan-400",
};

export function TerminalMetricCard({
  label,
  value,
  subValue,
  icon: Icon,
  variant = "default",
  className,
  description,
}: TerminalMetricCardProps) {
  return (
    <Card className={cn("backdrop-blur", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
        {Icon && <Icon className={cn("h-4 w-4", valueStyles[variant])} />}
      </CardHeader>
      <CardContent>
        <p className={cn("font-mono text-xl font-bold tracking-tight", valueStyles[variant])}>
          {value}
        </p>
        {subValue && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">{subValue}</p>
        )}
        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
