import type { Option } from "lib/types";

export interface PoolLiquidity {
  denom: string;
  amount: string;
}

export interface PoolWeight {
  denom: string;
  weight: string;
}
export interface TotalShares {
  denom: string;
  amount: string;
}

export interface SmoothWeightChangeParams {
  start_time: string;
  duration: string;
}
export interface PoolAccount {
  address: string;
  id: number;
}
export interface PoolDetail {
  pool_id: number;
  create_tx_id: number;
  account: PoolAccount;
  pool_liquidity: PoolLiquidity[];
  pool_type: string;
  is_superfluid: boolean;
  is_supported: boolean;
  swap_fee: string;
  exit_fee: string;
  future_pool_governor: Option<string | null>;
  smooth_weight_change_params: Option<object | null>;
  scaling_factors: Option<string[] | null>;
  scaling_factor_controller: Option<string | null>;
  weight: Option<PoolWeight[] | null>;
  address: string;
  total_shares: TotalShares;
}
