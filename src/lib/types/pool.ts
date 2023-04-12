import type { Coin } from "@cosmjs/stargate";

import type { Addr, ContractAddr, Option } from "lib/types";

interface PoolWeight {
  denom: string;
  weight: string;
}

export interface Pool {
  id: number;
  type: string;
  isSuperfluid: boolean;
  poolLiquidity: Coin[];
}

export interface PoolDetail extends Pool {
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
