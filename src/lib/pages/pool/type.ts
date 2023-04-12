import type { Big } from "big.js";

import type { Addr, ContractAddr, Option, TokenWithValue } from "lib/types";

export interface PoolWeight {
  denom: string;
  weight: Big;
}

export interface PoolCardData {
  id: number;
  type: string;
  isSuperfluid: boolean;
  poolLiquidity: TokenWithValue[];
}

export interface PoolData extends PoolCardData {
  isSupported: boolean;
  blockHeight: Option<number>;
  creator: Option<Addr>;
  poolAddress: ContractAddr;
  swapFee: number;
  exitFee: number;
  futurePoolGovernor: string | null;
  smoothWeightChangeParams: Option<object | null>;
  scalingFactors: Option<string[] | null>;
  scalingFactorController: Option<string | null>;
  weight: Option<PoolWeight[] | null>;
}
