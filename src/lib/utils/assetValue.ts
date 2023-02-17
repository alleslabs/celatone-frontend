import type { BigSource } from "big.js";
import big from "big.js";

export const assetValue = (amount: BigSource, price: BigSource) =>
  big(amount).mul(price);
