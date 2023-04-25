import type { Coin } from "@cosmjs/stargate";
import type { Big } from "big.js";

import type {
  Addr,
  ContractAddr,
  Option,
  Ratio,
  TokenWithValue,
} from "lib/types";

export type PoolTypeFilter = "All" | "Balancer" | "Stableswap";

export interface PoolWeight<T extends string | Big = Big> {
  denom: string;
  weight: T;
  percentWeight: string | null;
}

export interface Pool<
  TLiquidity extends Coin | TokenWithValue = TokenWithValue
> {
  id: number;
  type: string;
  isSuperfluid: boolean;
  poolLiquidity: TLiquidity[];
}

export interface PoolDetail<
  TWeight extends string | Big = Big,
  TLiquidity extends Coin | TokenWithValue = TokenWithValue
> extends Pool<TLiquidity> {
  isSupported: boolean;
  blockHeight: Option<number>;
  creator: Option<Addr>;
  poolAddress: ContractAddr;
  swapFee: Ratio<number>;
  exitFee: Ratio<number>;
  futurePoolGovernor: string | null;
  smoothWeightChangeParams: object | null;
  scalingFactors: string[] | null;
  scalingFactorController: string | null;
  weight: PoolWeight<TWeight>[] | null;
}
