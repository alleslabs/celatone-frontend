import type { Big, BigSource } from "big.js";
import big from "big.js";

import type { Balance, Token, U, USD } from "lib/types";

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
