import type { Option } from "lib/types";

export interface Balance {
  amount: string;
  id: string;
  name?: Option<string>;
  precision: number;
  symbol?: Option<string>;
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
  slugs: string[];
  symbol: string;
  type: string;
  price: number;
}

export interface BalanceWithAssetInfo {
  balance: Balance;
  assetInfo: Option<AssetInfo>;
}
