import type { StdFee } from "@cosmjs/stargate";
import type { AssetInfos, Coin, MovePoolInfos, Option, Ratio } from "lib/types";

import { big } from "lib/types";

import { coinToTokenWithValue } from "./assetValue";
import { coinsFromStr } from "./funds";

export const feeFromStr = (uFee: Option<string>): Option<StdFee> => {
  if (!uFee) return undefined;

  const fee: StdFee = {
    amount: coinsFromStr(uFee),
    gas: "0",
  };

  return fee;
};

export const computeCosmosFee = (
  feeCoin: Option<Coin>,
  gasUsed: string,
  gasLimit: string,
  gasRefundRatio: Option<Ratio<number>>,
  assetInfos: Option<AssetInfos>,
  movePoolInfos: Option<MovePoolInfos>
) => {
  if (!feeCoin) return undefined;

  if (gasRefundRatio) {
    const gasPrice = big(feeCoin.amount).div(gasLimit);
    const gasRefund = big(gasLimit).minus(gasUsed).mul(gasRefundRatio);
    const actualFeeAmount = gasPrice.mul(big(gasLimit).minus(gasRefund));
    return coinToTokenWithValue(
      feeCoin.denom,
      actualFeeAmount.toFixed(0),
      assetInfos,
      movePoolInfos
    );
  }

  return coinToTokenWithValue(
    feeCoin.denom,
    feeCoin.amount,
    assetInfos,
    movePoolInfos
  );
};
