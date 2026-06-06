import type { Quote } from "@ston-fi/omniston-sdk";
import { isSwapQuote } from "@ston-fi/omniston-sdk";
import type { OmnistonAssetMeta } from "@/lib/omniston/assets";
import { unitsToFloat } from "@/lib/omniston/utils";

export interface RouteStepDetail {
  routeIndex: number;
  stepIndex: number;
  chunkIndex: number;
  protocol: string;
  inputAmount: number;
  outputAmount: number;
}

export function extractRouteSteps(
  quote: Quote,
  inputAsset: OmnistonAssetMeta,
  outputAsset: OmnistonAssetMeta
): RouteStepDetail[] {
  if (!isSwapQuote(quote)) return [];

  const steps: RouteStepDetail[] = [];

  quote.settlementData.value.routes.forEach((route, routeIndex) => {
    route.steps.forEach((step, stepIndex) => {
      step.chunks.forEach((chunk, chunkIndex) => {
        steps.push({
          routeIndex,
          stepIndex,
          chunkIndex,
          protocol: chunk.protocol,
          inputAmount: unitsToFloat(chunk.inputUnits, inputAsset.decimals),
          outputAmount: unitsToFloat(chunk.outputUnits, outputAsset.decimals),
        });
      });
    });
  });

  return steps;
}

export function getUniqueProtocols(steps: RouteStepDetail[]): string[] {
  const protocols: string[] = [];
  for (const step of steps) {
    if (!protocols.includes(step.protocol)) {
      protocols.push(step.protocol);
    }
  }
  return protocols;
}
