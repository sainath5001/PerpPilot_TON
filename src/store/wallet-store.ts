import { create } from "zustand";
import type { WalletStoreState } from "@/types/wallet";

const initialState = {
  status: "disconnected" as const,
  wallet: null,
  isHydrated: false,
};

export const useWalletStore = create<WalletStoreState>((set) => ({
  ...initialState,
  setStatus: (status) => set({ status }),
  setWallet: (wallet) =>
    set({
      wallet,
      status: wallet ? "connected" : "disconnected",
    }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  reset: () => set({ ...initialState, isHydrated: true }),
}));

export const selectIsWalletConnected = (state: WalletStoreState) =>
  state.status === "connected" && state.wallet !== null;

export const selectWalletAddress = (state: WalletStoreState) =>
  state.wallet?.address ?? null;
