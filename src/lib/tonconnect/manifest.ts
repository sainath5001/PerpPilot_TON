export function getTonConnectManifestUrl(): string {
  if (typeof window === "undefined") {
    throw new Error("TonConnect manifest URL requires a browser environment");
  }
  return `${window.location.origin}/tonconnect-manifest.json`;
}

export async function verifyTonConnectManifest(): Promise<{
  ok: boolean;
  url: string;
  error?: string;
}> {
  const url = getTonConnectManifestUrl();

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return {
        ok: false,
        url,
        error: `Manifest not found (${res.status}). Open ${url} in your browser to verify.`,
      };
    }

    const data = (await res.json()) as { url?: string; iconUrl?: string };
    if (!data.url || !data.iconUrl) {
      return { ok: false, url, error: "Manifest is missing required fields." };
    }

    const iconRes = await fetch(data.iconUrl, { cache: "no-store" });
    if (!iconRes.ok) {
      return {
        ok: false,
        url,
        error: `Manifest icon not found (${iconRes.status}).`,
      };
    }

    return { ok: true, url };
  } catch (err) {
    return {
      ok: false,
      url,
      error: err instanceof Error ? err.message : "Failed to load manifest",
    };
  }
}
