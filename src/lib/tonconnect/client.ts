import { AppKit, Network, TonConnectConnector } from "@ton/appkit";
import { TonConnectUI, THEME } from "@tonconnect/ui";

const TONCONNECT_CONNECTOR_ID = "tonconnect";

/** Production origin — Tonkeeper validates manifest url/iconUrl against this domain. */
export const TON_CONNECT_APP_ORIGIN = "https://perp-pilot-ton.vercel.app";

let tonConnectUI: TonConnectUI | null = null;
let appKit: AppKit | null = null;

/** Always load the hosted manifest (never localhost — wallets cannot reach it). */
export function getTonConnectManifestUrl(): string {
  return `${TON_CONNECT_APP_ORIGIN}/tonconnect-manifest.json`;
}

/** Module singleton — survives React Strict Mode remounts. */
export function getTonConnectUI(): TonConnectUI {
  if (typeof window === "undefined") {
    throw new Error("TonConnect is browser-only");
  }

  if (!tonConnectUI) {
    tonConnectUI = new TonConnectUI({
      manifestUrl: getTonConnectManifestUrl(),
      restoreConnection: false,
      uiPreferences: { theme: THEME.DARK },
    });
  }

  return tonConnectUI;
}

export function getAppKit(): AppKit {
  if (!appKit) {
    appKit = new AppKit({
      defaultNetwork: Network.mainnet(),
      networks: {
        [Network.mainnet().chainId]: {},
        [Network.testnet().chainId]: {},
      },
      connectors: [
        new TonConnectConnector({
          id: TONCONNECT_CONNECTOR_ID,
          tonConnectUI: getTonConnectUI(),
        }),
      ],
    });
  }

  return appKit;
}

export function isTonConnectAbortError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("Aborted after attempts");
}
