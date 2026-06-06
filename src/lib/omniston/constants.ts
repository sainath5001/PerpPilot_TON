/** Omniston WebSocket API — production endpoint */
export const OMNISTON_API_URL = "wss://omni-ws.ston.fi";

/** Debounce before requesting a new RFQ stream (ms) */
export const OMNISTON_QUOTE_DEBOUNCE_MS = 400;

/** Default max price slippage: 10_000 pips = 1% (Omniston pip = 0.0001%) */
export const DEFAULT_MAX_PRICE_SLIPPAGE_PIPS = 10_000;

/** Pips denominator per Omniston protocol (1 pip = 0.0001%) */
export const OMNISTON_PIPS_DENOMINATOR = 1_000_000;

/** Swap transaction validity window (seconds) */
export const SWAP_TX_VALID_UNTIL_SECONDS = 5 * 60;
