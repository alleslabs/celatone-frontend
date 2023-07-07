import type { Big, BigSource } from "big.js";
import big from "big.js";

import type { Percent, Ratio } from "lib/types";

import { d2Formatter, d6Formatter } from "./token";

export const toPercent = (value: BigSource): string =>
  big(value).times(100).toFixed();

export const formatPercent = (value: Percent<BigSource>): string => {
  const x = big(value);
  const lowestThreshold = 0.000001;

  const d2 = d2Formatter(x, "0.00");
  const d6 = d6Formatter(x, "0.00");

  if (x.eq(0) || x.gte(1)) {
    return `${d2}%`;
  }

  if (x.lt(lowestThreshold)) {
    return `<${lowestThreshold}%`;
  }
  return `${d6}%`;
};

/**
 * @param ratio
 * @returns formatted percentage string
 * @description Use this function to format ratio (e.g. 0.55, 0.14789) to percentage string (e.g. 55.55%, 0.123456%)
 */
export const formatRatio = (ratio: Ratio<BigSource>): string =>
  formatPercent(big(ratio).times(100) as Percent<Big>);
