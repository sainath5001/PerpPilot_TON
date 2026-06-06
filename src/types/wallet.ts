export type WalletConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

export interface ConnectedWalletState {
  address: string;
  rawAddress: string;
  walletName: string;
  walletId: string;
  network: "mainnet" | "testnet";
}

export interface WalletStoreState {
  status: WalletConnectionStatus;
  wallet: ConnectedWalletState | null;
  isHydrated: boolean;
  setStatus: (status: WalletConnectionStatus) => void;
  setWallet: (wallet: ConnectedWalletState | null) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}
