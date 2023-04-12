import type { Big } from "big.js";
import big from "big.js";

import type {
  Addr,
  AssetInfo,
  ContractAddr,
  Option,
  Token,
  U,
  USD,
} from "lib/types";
import { calculateAssetValue, toToken } from "lib/utils";

export const coinToTokenWithValue = (
  denom: string,
  amount: string,
  assetInfo: Option<AssetInfo>
): TokenWithValue => {
  const tokenAmount = big(amount) as U<Token<Big>>;
  return {
    denom,
    amount: tokenAmount,
    logo: assetInfo?.logo,
    precision: assetInfo?.precision,
    value: assetInfo
      ? calculateAssetValue(
          toToken(tokenAmount, assetInfo.precision),
          assetInfo.price as USD<number>
        )
      : undefined,
  };
};

// TODO: combine with the type in delegation
export interface TokenWithValue {
  denom: string;
  amount: U<Token<Big>>;
  logo: Option<string>;
  precision: Option<number>;
  value: Option<USD<Big>>;
}

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
