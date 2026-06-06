import type { AssetId, ChainAddress } from "@ston-fi/omniston-sdk";

/** Known TON mainnet collateral / swap assets for PerpPilot */
export const TON_USDT_JETTON =
  "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

export const TON_USDC_JETTON =
  "EQBynBO23ywHy_CgarY9NK5DMs-2DQ-M_XeRQA3qedK-3fP";

export interface OmnistonAssetMeta {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  assetId: AssetId;
  isNative: boolean;
  iconColor: string;
  isCollateral?: boolean;
}

export function tonNativeAssetId(): AssetId {
  return {
    chain: {
      $case: "ton",
      value: {
        kind: { $case: "native", value: {} },
      },
    },
  };
}

export function tonJettonAssetId(jettonAddress: string): AssetId {
  return {
    chain: {
      $case: "ton",
      value: {
        kind: { $case: "jetton", value: jettonAddress },
      },
    },
  };
}

export function tonChainAddress(address: string): ChainAddress {
  return {
    chain: {
      $case: "ton",
      value: address,
    },
  };
}

export const OMNISTON_ASSETS: Record<string, OmnistonAssetMeta> = {
  TON: {
    id: "TON",
    symbol: "TON",
    name: "Toncoin",
    decimals: 9,
    assetId: tonNativeAssetId(),
    isNative: true,
    iconColor: "#0098ea",
  },
  USDT: {
    id: "USDT",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    assetId: tonJettonAssetId(TON_USDT_JETTON),
    isNative: false,
    iconColor: "#26a17b",
    isCollateral: true,
  },
  USDC: {
    id: "USDC",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    assetId: tonJettonAssetId(TON_USDC_JETTON),
    isNative: false,
    iconColor: "#2775ca",
    isCollateral: true,
  },
};

export const OMNISTON_ASSET_LIST = Object.values(OMNISTON_ASSETS);
export const DEFAULT_COLLATERAL_ASSET = OMNISTON_ASSETS.USDT;
export const DEFAULT_INPUT_ASSET = OMNISTON_ASSETS.TON;

export function getOmnistonAsset(id: string): OmnistonAssetMeta | undefined {
  return OMNISTON_ASSETS[id];
}
