import { AppKit, Network, TonConnectConnector } from "@ton/appkit";
import { TonConnectUI, THEME } from "@tonconnect/ui";

const TONCONNECT_CONNECTOR_ID = "tonconnect";

let tonConnectUI: TonConnectUI | null = null;
let appKit: AppKit | null = null;

/** Stable manifest URL — never use 0.0.0.0 (Tonkeeper cannot reach it). */
export function getTonConnectManifestUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000/tonconnect-manifest.json";
  }

  const { protocol, hostname, port } = window.location;
  const host =
    hostname === "0.0.0.0" || hostname === "127.0.0.1"
      ? "localhost"
      : hostname;
  const portSuffix = port ? `:${port}` : "";

  return `${protocol}//${host}${portSuffix}/tonconnect-manifest.json`;
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
