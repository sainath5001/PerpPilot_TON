export type {
  WalletConnectionStatus,
  ConnectedWalletState,
  WalletStoreState,
} from "./wallet";

export type {
  PositionSide,
  RiskLevel,
  PositionAnalysisInput,
  RiskMetrics,
  DashboardMetric,
} from "./trading";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  disabled?: boolean;
  badge?: string;
}

export interface AppConfig {
  name: string;
  tagline: string;
  description: string;
}
