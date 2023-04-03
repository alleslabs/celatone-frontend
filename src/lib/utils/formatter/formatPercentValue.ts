import type { Big } from "big.js";
import big from "big.js";

import { d2Formatter, d6Formatter } from "./token";

export const formatPercentValue = (value: Big): string => {
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
