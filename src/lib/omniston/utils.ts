import { OMNISTON_PIPS_DENOMINATOR } from "./constants";

export function floatToUnits(value: string | number, decimals: number): bigint {
  const str = typeof value === "number" ? value.toString() : value.trim();
  if (!str || str === ".") return BigInt(0);

  const [whole = "0", fraction = ""] = str.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  const combined = `${whole}${paddedFraction}`.replace(/^0+(?=\d)/, "") || "0";
  return BigInt(combined);
}

export function unitsToFloat(units: string | bigint, decimals: number): number {
  const value = typeof units === "bigint" ? units : BigInt(units || "0");
  if (decimals === 0) return Number(value);
  const str = value.toString().padStart(decimals + 1, "0");
  const whole = str.slice(0, -decimals) || "0";
  const fraction = str.slice(-decimals);
  return parseFloat(`${whole}.${fraction}`);
}

export function formatUnits(
  units: string | bigint,
  decimals: number,
  maxFractionDigits = 6
): string {
  const num = unitsToFloat(units, decimals);
  return num.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits });
}

export function percentToPips(percent: number): number {
  return Math.round((percent / 100) * OMNISTON_PIPS_DENOMINATOR);
}

export function pipsToPercent(pips: number): number {
  return (pips / OMNISTON_PIPS_DENOMINATOR) * 100;
}

export function hexToBase64(hex: string): string {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(
    normalized.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []
  );
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}
