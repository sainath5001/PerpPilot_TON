import { z } from "zod";

export const tradePlannerSchema = z.object({
  assetId: z.enum(["BTCUSD", "ETHUSD", "TONUSD", "SOLUSD"]),
  side: z.enum(["long", "short"]),
  entryPrice: z
    .number({ error: "Entry price is required" })
    .positive("Entry price must be positive"),
  size: z
    .number({ error: "Size is required" })
    .positive("Size must be positive"),
  leverage: z
    .number({ error: "Leverage is required" })
    .min(1, "Minimum 1x leverage")
    .max(100, "Maximum 100x leverage"),
  collateral: z
    .number({ error: "Collateral is required" })
    .positive("Collateral must be positive"),
});

export type TradePlannerFormValues = z.infer<typeof tradePlannerSchema>;

export const defaultTradePlannerValues: TradePlannerFormValues = {
  assetId: "BTCUSD",
  side: "long",
  entryPrice: 0,
  size: 0,
  leverage: 10,
  collateral: 0,
};
