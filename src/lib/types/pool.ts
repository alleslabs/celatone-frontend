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
  CL = "Concentrated",
  COSMWASM = "CosmWasm",
  STABLESWAP = "Stableswap",
}

export type PoolTypeFilter = PoolType;

export interface PoolWeight {
  denom: string;
  percentWeight: Nullable<string>;
  weight: Big;
}

export interface Pool {
  contractAddress: Nullish<BechAddr32>;
  id: number;
  isSuperfluid: boolean;
  liquidity: TokenWithValue[];
  type: PoolType;
}

export interface PoolData extends Pool {
  address: BechAddr32;
  contractAddress: Nullish<BechAddr32>;
  createdHeight: Option<number>;
  creator: Option<BechAddr>;
  exitFee: string;
  futurePoolGovernor: string;
  isSupported: boolean;
  scalingFactorController: Nullable<string>;
  scalingFactors: Nullable<number[]>;
  smoothWeightChangeParams: Nullable<object>;
  spreadFactor: Nullable<string>;
  swapFee: string;
  tickSpacing: Nullable<number>;
  weight: Nullable<PoolWeight[]>;
}

// MARK: move
export interface PoolInfo {
  coinA: {
    amount: U<Token<Big>>;
    denom: string;
    precision: Option<number>;
    symbol: Option<string>;
  };
  coinB: {
    amount: U<Token<Big>>;
    denom: string;
    precision: Option<number>;
    symbol: Option<string>;
  };
}
