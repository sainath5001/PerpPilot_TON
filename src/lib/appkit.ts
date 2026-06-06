import { AppKit, Network, TonConnectConnector } from "@ton/appkit-react";

export function createAppKit() {
  const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

  return new AppKit({
    defaultNetwork: Network.mainnet(),
    networks: {
      [Network.mainnet().chainId]: {},
      [Network.testnet().chainId]: {},
    },
    connectors: [
      new TonConnectConnector({
        tonConnectOptions: {
          manifestUrl,
        },
      }),
    ],
  });
}
