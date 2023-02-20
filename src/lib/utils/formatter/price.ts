import type { BigSource } from "big.js";
import big from "big.js";

/**
 * @remarks
 * If the value is greater then or equal to 1, should return 2 decimal point
 *
 */
export const formatPrice = (value: BigSource) => {
  const price = big(value);
  return price.gte(1) ? price.toFixed(2) : price;
};
