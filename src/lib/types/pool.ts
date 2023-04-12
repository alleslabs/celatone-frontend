import type { Coin } from "@cosmjs/stargate";
import type { Big } from "big.js";

import type { Addr, ContractAddr, Option, TokenWithValue } from "lib/types";

export interface PoolWeight<T extends string | Big> {
  denom: string;
  weight: T;
}

export interface Pool<TLiquidity extends Coin | TokenWithValue = Coin> {
  id: number;
  type: string;
  isSuperfluid: boolean;
  poolLiquidity: TLiquidity[];
}

export interface PoolDetail<
  TWeight extends string | Big = string,
  TLiquidity extends Coin | TokenWithValue = Coin
> extends Pool<TLiquidity> {
  isSupported: boolean;
  blockHeight: Option<number>;
  creator: Option<Addr>;
  poolAddress: ContractAddr;
  swapFee: number;
  exitFee: number;
  futurePoolGovernor: string | null;
  smoothWeightChangeParams: object | null;
  scalingFactors: string[] | null;
  scalingFactorController: string | null;
  weight: PoolWeight<TWeight>[] | null;
}
