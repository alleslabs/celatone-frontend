import type { Coin } from "@cosmjs/stargate";
import type { Big } from "big.js";

import type {
  Addr,
  ContractAddr,
  Nullable,
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

export interface PoolWeight<T extends string | Big = Big> {
  denom: string;
  weight: T;
  percentWeight: Nullable<string>;
}

export interface Pool<
  TLiquidity extends Coin | TokenWithValue = TokenWithValue,
> {
  id: number;
  type: PoolType;
  isSuperfluid: boolean;
  poolLiquidity: TLiquidity[];
  contractAddress: Option<Nullable<ContractAddr>>;
}

export interface PoolDetail<
  TWeight extends string | Big = Big,
  TLiquidity extends Coin | TokenWithValue = TokenWithValue,
> extends Pool<TLiquidity> {
  isSupported: boolean;
  blockHeight: Option<number>;
  creator: Option<Addr>;
  poolAddress: ContractAddr;
  swapFee: string;
  exitFee: string;
  futurePoolGovernor: string;
  weight: Nullable<PoolWeight<TWeight>[]>;
  smoothWeightChangeParams: Nullable<object>;
  scalingFactors: Nullable<string[]>;
  scalingFactorController: Nullable<string>;
  spreadFactor: Nullable<string>;
  tickSpacing: Nullable<number>;
  contractAddress: Nullable<ContractAddr>;
}

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
