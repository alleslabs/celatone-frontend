import type { Big, BigSource } from "big.js";
import big from "big.js";

import type { Balance, Token, U } from "lib/types";

import { formatUTokenWithPrecision } from "./formatter";

export const calculateAssetValue = (amount: BigSource, price: BigSource): Big =>
  big(amount).mul(price);

export const calAssetValueWithPrecision = (balance: Balance): Big => {
  if (balance.price) {
    return calculateAssetValue(
      formatUTokenWithPrecision(balance.amount as U<Token>, balance.precision),
      balance.price
    );
  }
  return big(0);
};
