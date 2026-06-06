"use client";

import { useConnectionStatus } from "@ston-fi/omniston-sdk-react";

export function useOmnistonConnection() {
  const status = useConnectionStatus();

  return {
    status,
    isReady: status === "ready" || status === "connected",
    isConnecting: status === "connecting",
    isError: status === "error",
    isClosed: status === "closed" || status === "closing",
  };
}
