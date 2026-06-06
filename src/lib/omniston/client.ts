import { Omniston } from "@ston-fi/omniston-sdk";
import { OMNISTON_API_URL } from "./constants";

let client: Omniston | null = null;

export function getOmnistonClient(): Omniston {
  if (!client) {
    client = new Omniston({
      apiUrl: OMNISTON_API_URL,
    });
  }
  return client;
}

export function resetOmnistonClient(): void {
  if (client && "close" in client && typeof client.close === "function") {
    client.close();
  }
  client = null;
}
