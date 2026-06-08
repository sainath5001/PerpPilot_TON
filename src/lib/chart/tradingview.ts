import type { ChartWidgetConfig } from "@/types/chart";

const TRADINGVIEW_SCRIPT_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

const CHART_BACKGROUND = "rgba(11, 14, 17, 1)";
const CHART_GRID = "rgba(42, 46, 56, 0.55)";

export function buildTradingViewWidgetOptions(config: ChartWidgetConfig) {
  return {
    autosize: true,
    symbol: config.symbol,
    interval: config.interval,
    timezone: "Etc/UTC",
    theme: config.theme,
    style: "1",
    locale: "en",
    enable_publishing: false,
    backgroundColor: config.backgroundColor,
    gridColor: config.gridColor,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_side_toolbar: false,
    allow_symbol_change: false,
    save_image: true,
    calendar: false,
    hide_volume: false,
    withdateranges: true,
    details: false,
    hotlist: false,
    support_host: "https://www.tradingview.com",
    studies: [],
    watchlist: [],
  };
}

export function createTradingViewWidgetConfig(
  symbol: string,
  interval: ChartWidgetConfig["interval"]
): ChartWidgetConfig {
  return {
    symbol,
    interval,
    theme: "dark",
    backgroundColor: CHART_BACKGROUND,
    gridColor: CHART_GRID,
  };
}

export function loadTradingViewEmbedScript(
  container: HTMLDivElement,
  config: ChartWidgetConfig,
  onLoad: () => void,
  onError: (message: string) => void
): () => void {
  container.innerHTML = "";

  const widgetHost = document.createElement("div");
  widgetHost.className = "tradingview-widget-container__widget";
  widgetHost.style.height = "100%";
  widgetHost.style.width = "100%";
  container.appendChild(widgetHost);

  const script = document.createElement("script");
  script.src = TRADINGVIEW_SCRIPT_URL;
  script.type = "text/javascript";
  script.async = true;
  script.innerHTML = JSON.stringify(buildTradingViewWidgetOptions(config));

  let settled = false;
  const settle = (fn: () => void) => {
    if (settled) return;
    settled = true;
    fn();
  };

  const timeoutId = window.setTimeout(() => {
    settle(() => onError("Chart timed out while loading. Check your connection."));
  }, 20_000);

  script.onload = () => {
    window.clearTimeout(timeoutId);
    window.setTimeout(() => settle(onLoad), 600);
  };

  script.onerror = () => {
    window.clearTimeout(timeoutId);
    settle(() => onError("Failed to load TradingView chart library."));
  };

  container.appendChild(script);

  return () => {
    window.clearTimeout(timeoutId);
    container.innerHTML = "";
  };
}
