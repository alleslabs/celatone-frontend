import type { BigSource } from "big.js";
import big from "big.js";

import type { Token, U } from "lib/types";

export const formatDemimal =
  ({
    decimalPoints,
    delimiter,
  }: {
    decimalPoints: number;
    delimiter: boolean;
  }) =>
  (n: BigSource, fallbackValue: string): string => {
    const num = big(
      big(n)
        .mul(10 ** decimalPoints)
        .toFixed()
        .split(".")[0]
    )
      .div(10 ** decimalPoints)
      .toFixed(decimalPoints);
    if (num === "NaN") return fallbackValue;

    const [i, d] = num.split(".");
    const thousands = /\B(?=(\d{3})+(?!\d))/g;

    const ii = delimiter ? i.replace(thousands, ",") : i;
    const dd = d ? `.${d}` : "";

    return (ii === "0" && num[0] === "-" ? "-" : "") + ii + dd;
  };

const d2Formatter = formatDemimal({ decimalPoints: 2, delimiter: true });
const d6Formatter = formatDemimal({ decimalPoints: 6, delimiter: true });

export const toToken = (
  uAmount: U<Token<BigSource>>,
  precision: number
): Token<BigSource> =>
  big(uAmount).div(big(10).pow(precision)) as Token<BigSource>;

export const formatUTokenWithPrecision = (
  amount: U<Token<BigSource>>,
  precision: number
): Token => d6Formatter(toToken(amount, precision), "0") as Token;

/**
 * @remarks
 * If the value is greater than or equal to 1, should return 2 decimal points else 6 decimal points
 *
 */
export const formatPrice = (value: BigSource) => {
  const price = big(value);
  return price.gte(1) ? d2Formatter(price, "0") : d6Formatter(price, "0");
};
