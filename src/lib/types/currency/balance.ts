import type { Option } from "lib/types";

export interface Balance {
  amount: string;
  id: string;
  name?: string;
  precision: number;
  symbol?: string;
  type?: string;
  price?: number;
}

export interface AssetInfo {
  coingecko: string;
  coinmarketcap: string;
  description: string;
  id: string;
  logo: string;
  name: string;
  precision: number;
  price: number;
  slugs: string[];
  symbol: string;
  type: string;
}

export interface BalanceWithAssetInfo {
  balance: Balance;
  assetInfo: Option<AssetInfo>;
}
