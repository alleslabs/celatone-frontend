import type { Coin } from "@cosmjs/stargate";
import type { Big } from "big.js";

import type { Addr, ContractAddr, Option, TokenWithValue } from "lib/types";

// TODO - Recheck type name
export enum PoolType {
  ALL = "All",
  BALANCER = "Balancer",
  STABLESWAP = "Stableswap",
  COSMWASM = "Cosmwasm",
  CL = "ConcentratedLiquidity",
}

export type PoolTypeFilter = PoolType;

export interface PoolWeight<T extends string | Big = Big> {
  denom: string;
  weight: T;
  percentWeight: string | null;
}

export interface Pool<
  TLiquidity extends Coin | TokenWithValue = TokenWithValue
> {
  id: number;
  type: PoolType;
  isSuperfluid: boolean;
  poolLiquidity: TLiquidity[];
  contractAddress: Option<ContractAddr | null>;
}

// TODO - Revisit when backend finished
export interface PoolDetail<
  TWeight extends string | Big = Big,
  TLiquidity extends Coin | TokenWithValue = TokenWithValue
> extends Pool<TLiquidity> {
  isSupported: boolean;
  blockHeight: Option<number>;
  creator: Option<Addr>;
  poolAddress: ContractAddr;
  swapFee: string | null;
  exitFee: string | null;
  futurePoolGovernor: string | null;
  weight: PoolWeight<TWeight>[] | null;
  smoothWeightChangeParams: object | null;
  scalingFactors: string[] | null;
  scalingFactorController: string | null;
  spreadFactor: string | null;
  tickSpacing: number | null;
  contractAddress: ContractAddr;
}
