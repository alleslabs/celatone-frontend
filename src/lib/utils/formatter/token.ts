import type { Big, BigSource } from "big.js";
import big from "big.js";

import type { Token, U, USD } from "lib/types";

const B = 1_000_000_000;

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

export const toToken = (
  uAmount: U<Token<BigSource>>,
  precision: number
): Token<Big> => big(uAmount).div(big(10).pow(precision)) as Token<Big>;

/**
 * @remarks
 * If token is more than or equal to 1 billion, should add suffix B and format to 2 decimal point
 *
 */
export const formatUTokenWithPrecision = (
  amount: U<Token<BigSource>>,
  precision: number,
  isSuffix = true
): string => {
  const token = toToken(amount, precision);
  if (isSuffix && token.gte(B)) {
    return `${formatDemimal({ decimalPoints: 2, delimiter: true })(
      token.div(B),
      "0.00"
    )}B`;
  }
  return formatDemimal({ decimalPoints: precision, delimiter: true })(
    token,
    "0.00"
  );
};

const d2Formatter = formatDemimal({ decimalPoints: 2, delimiter: true });
const d6Formatter = formatDemimal({ decimalPoints: 6, delimiter: true });

/**
 * @remarks
 * Condition for price rendering
 * $0 or >= $1 -> 2d
 * < $1 -> 6d
 * <$0.000001 -> <$0.000001
 */
export const formatPrice = (value: USD<BigSource>): string => {
  const price = big(value);
  const lowestThreshold = 0.000001;

  const d2 = d2Formatter(price, "0.00");
  const d6 = d6Formatter(price, "0.00");

  if (price.eq(0) || price.gte(1)) {
    return `$${d2}`;
  }

  if (price.lt(lowestThreshold)) {
    return `<$${lowestThreshold}`;
  }
  return `$${d6}`;
};
