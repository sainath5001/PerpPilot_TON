import { describe, expect, it } from "vitest";
import { analyzePosition, analyzePositionOrThrow } from "../analyze-position";
import {
  calculateDistanceToLiquidation,
  calculateLiquidationPrice,
  calculateMarginBuffer,
  calculateMarginUtilization,
} from "../calculate-liquidation-price";
import {
  calculateHealthScore,
  resolveRiskLevel,
  scoreLeverage,
} from "../calculate-health-score";
import {
  calculatePotentialPnL,
  calculateRiskReward,
} from "../calculate-potential-pnl";
import {
  buildPositionContext,
  calculateExposure,
  calculateMaintenanceMargin,
  calculatePositionSize,
  calculatePositionSizeNotional,
  resolveMaintenanceMarginRate,
} from "../calculate-position-size";
import { validateRiskInput } from "../validation";

describe("calculatePositionSize", () => {
  it("computes notional as collateral × leverage", () => {
    expect(calculatePositionSizeNotional(1000, 10)).toBe(10000);
  });

  it("computes base size from notional and entry", () => {
    const { notional, base } = calculatePositionSize(1000, 10, 50_000);
    expect(notional).toBe(10000);
    expect(base).toBeCloseTo(0.2, 6);
  });
});

describe("calculateExposure", () => {
  it("equals notional for isolated margin", () => {
    expect(calculateExposure(500, 20)).toBe(10000);
  });
});

describe("maintenance margin", () => {
  it("uses tiered rates by leverage", () => {
    expect(resolveMaintenanceMarginRate(5)).toBe(0.004);
    expect(resolveMaintenanceMarginRate(10)).toBe(0.005);
    expect(resolveMaintenanceMarginRate(25)).toBe(0.01);
    expect(resolveMaintenanceMarginRate(50)).toBe(0.015);
    expect(resolveMaintenanceMarginRate(100)).toBe(0.025);
  });

  it("computes maintenance margin from notional", () => {
    expect(calculateMaintenanceMargin(10000, 0.005)).toBe(50);
  });
});

describe("calculateLiquidationPrice", () => {
  it("computes long liquidation below entry", () => {
    const ctx = buildPositionContext({
      asset: "BTCUSD",
      side: "long",
      entryPrice: 100_000,
      collateral: 1000,
      leverage: 10,
    });
    const liq = calculateLiquidationPrice(ctx);
    expect(liq).toBeLessThan(100_000);
    expect(liq).toBeGreaterThan(0);
  });

  it("computes short liquidation above entry", () => {
    const ctx = buildPositionContext({
      asset: "BTCUSD",
      side: "short",
      entryPrice: 100_000,
      collateral: 1000,
      leverage: 10,
    });
    const liq = calculateLiquidationPrice(ctx);
    expect(liq).toBeGreaterThan(100_000);
  });

  it("returns entry when collateral at maintenance", () => {
    const ctx = buildPositionContext({
      asset: "BTCUSD",
      side: "long",
      entryPrice: 100_000,
      collateral: 50,
      leverage: 100,
    });
    if (ctx.collateral <= ctx.maintenanceMargin) {
      expect(calculateLiquidationPrice(ctx)).toBe(100_000);
    }
  });
});

describe("calculateDistanceToLiquidation", () => {
  it("returns positive distance for long", () => {
    const dist = calculateDistanceToLiquidation("long", 100_000, 90_000);
    expect(dist).toBeCloseTo(10, 1);
  });

  it("returns 0 when long mark at liquidation", () => {
    expect(calculateDistanceToLiquidation("long", 90_000, 90_000)).toBe(0);
  });
});

describe("calculateMarginBuffer", () => {
  it("computes buffer percentage", () => {
    expect(calculateMarginBuffer(1000, 50)).toBe(95);
  });

  it("returns 0 when collateral exhausted", () => {
    expect(calculateMarginBuffer(50, 100)).toBe(0);
  });
});

describe("calculateMarginUtilization", () => {
  it("is 100% when initial margin equals collateral", () => {
    expect(calculateMarginUtilization(1000, 1000)).toBe(100);
  });
});

describe("calculatePotentialPnL", () => {
  const ctx = buildPositionContext({
    asset: "ETHUSD",
    side: "long",
    entryPrice: 3000,
    collateral: 1000,
    leverage: 10,
  });

  it("caps long loss at collateral", () => {
    const { maximumLoss } = calculatePotentialPnL(ctx, 2500);
    expect(maximumLoss).toBeLessThanOrEqual(1000);
    expect(maximumLoss).toBeGreaterThan(0);
  });

  it("computes long profit at take profit", () => {
    const { potentialProfit } = calculatePotentialPnL(ctx, undefined, 3300);
    expect(potentialProfit).toBeCloseTo(1000, 0);
  });

  it("defaults max loss to collateral without stop loss", () => {
    const { maximumLoss } = calculatePotentialPnL(ctx);
    expect(maximumLoss).toBe(1000);
  });
});

describe("calculateRiskReward", () => {
  it("computes ratio", () => {
    expect(calculateRiskReward(300, 100)).toBe(3);
  });

  it("returns null without profit", () => {
    expect(calculateRiskReward(null, 100)).toBeNull();
  });
});

describe("calculateHealthScore", () => {
  it("scores low leverage higher", () => {
    expect(scoreLeverage(2)).toBeGreaterThan(scoreLeverage(50));
  });

  it("returns low risk for healthy trades", () => {
    const { healthScore } = calculateHealthScore({
      leverage: 5,
      distanceToLiquidation: 15,
      marginBufferPercentage: 95,
      riskRewardRatio: 2.5,
      side: "long",
      entryPrice: 100_000,
      stopLoss: 95_000,
      liquidationPrice: 90_000,
    });
    expect(healthScore).toBeGreaterThan(50);
    expect(resolveRiskLevel(healthScore)).not.toBe("critical");
  });
});

describe("validateRiskInput", () => {
  it("rejects invalid leverage", () => {
    const errors = validateRiskInput({
      asset: "BTCUSD",
      side: "long",
      entryPrice: 100_000,
      collateral: 1000,
      leverage: 200,
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects long stop above entry", () => {
    const errors = validateRiskInput({
      asset: "BTCUSD",
      side: "long",
      entryPrice: 100_000,
      collateral: 1000,
      leverage: 10,
      stopLoss: 101_000,
    });
    expect(errors.some((e) => e.includes("stop loss"))).toBe(true);
  });
});

describe("analyzePosition", () => {
  it("returns full metrics for valid long trade", () => {
    const result = analyzePosition({
      asset: "BTCUSD",
      side: "long",
      entryPrice: 100_000,
      collateral: 1000,
      leverage: 10,
      stopLoss: 95_000,
      takeProfit: 110_000,
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.metrics.positionSizeNotional).toBe(10000);
    expect(result.metrics.effectiveExposure).toBe(10000);
    expect(result.metrics.estimatedLiquidationPrice).toBeLessThan(100_000);
    expect(result.metrics.healthScore).toBeGreaterThanOrEqual(0);
    expect(result.metrics.healthScore).toBeLessThanOrEqual(100);
    expect(result.metrics.riskRewardRatio).not.toBeNull();
  });

  it("returns errors for invalid input", () => {
    const result = analyzePosition({
      asset: "BTCUSD",
      side: "long",
      entryPrice: -1,
      collateral: 1000,
      leverage: 10,
    });
    expect(result.success).toBe(false);
  });

  it("analyzePositionOrThrow throws on invalid input", () => {
    expect(() =>
      analyzePositionOrThrow({
        asset: "BTCUSD",
        side: "long",
        entryPrice: 100_000,
        collateral: 0,
        leverage: 10,
      })
    ).toThrow();
  });

  it("warns when stop loss beyond liquidation", () => {
    const result = analyzePosition({
      asset: "TONUSD",
      side: "long",
      entryPrice: 5,
      collateral: 100,
      leverage: 50,
      stopLoss: 4.99,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.metrics.warnings.length).toBeGreaterThan(0);
  });
});
