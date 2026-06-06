import { z } from "zod";

export const tradePlannerSchema = z
  .object({
    assetId: z.enum(["BTCUSD", "ETHUSD", "TONUSD", "SOLUSD"]),
    side: z.enum(["long", "short"]),
    entryPrice: z
      .number({ error: "Entry price is required" })
      .positive("Entry price must be positive"),
    leverage: z
      .number({ error: "Leverage is required" })
      .min(1, "Minimum 1x leverage")
      .max(100, "Maximum 100x leverage"),
    collateral: z
      .number({ error: "Collateral is required" })
      .positive("Collateral must be positive"),
    stopLoss: z.number().positive("Stop loss must be positive").optional(),
    takeProfit: z.number().positive("Take profit must be positive").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.stopLoss !== undefined) {
      if (data.side === "long" && data.stopLoss >= data.entryPrice) {
        ctx.addIssue({
          code: "custom",
          message: "Long stop loss must be below entry price",
          path: ["stopLoss"],
        });
      }
      if (data.side === "short" && data.stopLoss <= data.entryPrice) {
        ctx.addIssue({
          code: "custom",
          message: "Short stop loss must be above entry price",
          path: ["stopLoss"],
        });
      }
    }

    if (data.takeProfit !== undefined) {
      if (data.side === "long" && data.takeProfit <= data.entryPrice) {
        ctx.addIssue({
          code: "custom",
          message: "Long take profit must be above entry price",
          path: ["takeProfit"],
        });
      }
      if (data.side === "short" && data.takeProfit >= data.entryPrice) {
        ctx.addIssue({
          code: "custom",
          message: "Short take profit must be below entry price",
          path: ["takeProfit"],
        });
      }
    }
  });

export type TradePlannerFormValues = z.infer<typeof tradePlannerSchema>;

export const defaultTradePlannerValues: TradePlannerFormValues = {
  assetId: "BTCUSD",
  side: "long",
  entryPrice: 0,
  leverage: 10,
  collateral: 0,
};
