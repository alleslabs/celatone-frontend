import type Big from "big.js";

import type {
  BechAddr,
  BechAddr32,
  Nullable,
  Nullish,
  Option,
  Token,
  TokenWithValue,
  U,
} from "lib/types";

export enum PoolType {
  ALL = "All",
  BALANCER = "Balancer",
  STABLESWAP = "Stableswap",
  COSMWASM = "CosmWasm",
  CL = "Concentrated",
}

export type PoolTypeFilter = PoolType;

export interface PoolWeight {
  denom: string;
  weight: Big;
  percentWeight: Nullable<string>;
}

export interface Pool {
  id: number;
  type: PoolType;
  isSuperfluid: boolean;
  liquidity: TokenWithValue[];
  contractAddress: Nullish<BechAddr32>;
}

export interface PoolData extends Pool {
  isSupported: boolean;
  createdHeight: Option<number>;
  creator: Option<BechAddr>;
  address: BechAddr32;
  swapFee: string;
  exitFee: string;
  futurePoolGovernor: string;
  weight: Nullable<PoolWeight[]>;
  smoothWeightChangeParams: Nullable<object>;
  scalingFactors: Nullable<number[]>;
  scalingFactorController: Nullable<string>;
  spreadFactor: Nullable<string>;
  tickSpacing: Nullable<number>;
  contractAddress: Nullish<BechAddr32>;
}

// MARK: move
export interface PoolInfo {
  coinA: {
    amount: U<Token<Big>>;
    precision: Option<number>;
    denom: string;
    symbol: Option<string>;
  };
  coinB: {
    amount: U<Token<Big>>;
    precision: Option<number>;
    denom: string;
    symbol: Option<string>;
  };
}
