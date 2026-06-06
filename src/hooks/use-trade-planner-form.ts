"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  defaultTradePlannerValues,
  tradePlannerSchema,
  type TradePlannerFormValues,
} from "@/lib/trade-planner/schema";

export function useTradePlannerForm() {
  return useForm<TradePlannerFormValues>({
    resolver: zodResolver(tradePlannerSchema),
    defaultValues: defaultTradePlannerValues,
    mode: "onChange",
  });
}
