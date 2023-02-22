import type { Big, BigSource } from "big.js";
import big from "big.js";

import type { Balance, Token } from "lib/types";

import { tokenWithPrecision } from "./formatter";

export const calculateAssetValue = (amount: BigSource, price: BigSource): Big =>
  big(amount).mul(price);

export const calAssetValueWithPrecision = (balance: Balance): Big => {
  if (balance.price) {
    return calculateAssetValue(
      tokenWithPrecision(balance.amount as Token, balance.precision),
      balance.price
    );
  }
  return big(0);
};
