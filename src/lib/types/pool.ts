import type { Option } from "lib/types";

// export enum PoolType {
//   BALANCER = "Balancer",
//   STABLE_SWAP = "Stable Swap",
// }

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
export interface PoolDetail {
  pool_id: number;
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
