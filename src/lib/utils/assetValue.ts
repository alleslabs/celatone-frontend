import type { BigSource } from "big.js";
import big from "big.js";

export const assetValue = (amount: BigSource, price: BigSource) =>
  big(amount).mul(price);

/**
 * @remarks
 * If the value of the asset is more than 1, should return 2 decimal point
 *
 */
export const displayAssetValue = (amount: BigSource, price: BigSource) => {
  const value = assetValue(amount, price);
  return value.lt(1) ? value : value.toFixed(2);
};
