import type { BigSource } from "big.js";
import big, { Big } from "big.js";

import type { Balance, BalanceWithAssetInfo, Token, U, USD } from "lib/types";

import { toToken } from "./formatter";

export const calculateAssetValue = (
  amount: Token<BigSource>,
  price: USD<number>
): USD<Big> => big(amount).mul(price) as USD<Big>;

export const calAssetValueWithPrecision = (balance: Balance): USD<Big> => {
  if (balance.price) {
    return calculateAssetValue(
      toToken(balance.amount as U<Token>, balance.precision),
      balance.price as USD<number>
    );
  }
  return big(0) as USD<Big>;
};

export const calTotalValue = (assets: BalanceWithAssetInfo[]): USD<Big> =>
  assets.reduce((acc: USD<Big>, curr: BalanceWithAssetInfo) => {
    return acc.add(calAssetValueWithPrecision(curr.balance)) as USD<Big>;
  }, Big(0) as USD<Big>);
