import type { AssetInfo, Option } from "lib/types";

export interface Balance {
  amount: string;
  id: string;
  name?: string;
  precision: number;
  symbol?: string;
  type?: string;
  price?: number;
}

export interface BalanceWithAssetInfo {
  isLPToken?: boolean;
  balance: Balance;
  assetInfo?: AssetInfo;
  logo?: Option<string>[];
}
