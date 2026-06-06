import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetric } from "@/types";

interface MetricCardProps extends DashboardMetric {
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend = "neutral",
  description,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("border-border/80 bg-card/60 backdrop-blur", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change && (
            <Badge
              variant={
                trend === "up"
                  ? "success"
                  : trend === "down"
                    ? "danger"
                    : "secondary"
              }
            >
              {change}
            </Badge>
          )}
        </div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
