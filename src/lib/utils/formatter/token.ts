import type { Big, BigSource } from "big.js";

import { big } from "lib/types";
import type { Token, U, USD } from "lib/types";

const INVALID = "N/A";

const T = 1_000_000_000_000;
const B = 1_000_000_000;
const M = 1_000_000;
const K = 1_000;

export const formatDecimal =
  ({
    decimalPoints,
    delimiter,
    hasTrailingZeros = true,
  }: {
    decimalPoints: number;
    delimiter: boolean;
    hasTrailingZeros?: boolean;
  }) =>
  (n: BigSource, fallbackValue: string): string => {
    try {
      // TODO: fix after having unit test for this fn
      // const num = big(n).toFixed(decimalPoints, big.roundHalfUp);
      const num = big(
        big(n)
          .mul(10 ** decimalPoints)
          .toFixed()
          .split(".")[0]
      )
        .div(10 ** decimalPoints)
        .toFixed(hasTrailingZeros ? decimalPoints : undefined);

      const [i, d] = num.split(".");
      const thousands = /\B(?=(\d{3})+(?!\d))/g;

      const ii = delimiter ? i.replace(thousands, ",") : i;
      const dd = d ? `.${d}` : "";

      return (ii === "0" && num[0] === "-" ? "-" : "") + ii + dd;
    } catch (e) {
      return fallbackValue;
    }
  };

export const d0Formatter = formatDecimal({ decimalPoints: 0, delimiter: true });
export const d2Formatter = formatDecimal({ decimalPoints: 2, delimiter: true });
export const d6Formatter = formatDecimal({ decimalPoints: 6, delimiter: true });

export const toToken = (
  uAmount: U<Token<BigSource>>,
  precision: number
  // TODO: try toFixed(precision) here after having unit test?
): Token<Big> => {
  try {
    const value = big(uAmount).div(big(10).pow(precision));
    return value as Token<Big>;
  } catch {
    return big(0) as Token<Big>;
  }
};

/**
 * @remarks
 * If token is more than or equal to 1 billion, should add suffix B and format to 2 decimal point
 *
 */
export const formatUTokenWithPrecision = (
  amount: U<Token<BigSource>>,
  precision: number,
  isSuffix = true,
  decimalPoints?: number,
  hasTrailingZeros?: boolean
): string => {
  const token = toToken(amount, precision);

  if (isSuffix) {
    if (token.gte(T)) return token.toExponential(2);
    if (token.gte(B)) return `${d2Formatter(token.div(B), "0.00")}B`;
    if (token.gte(M)) return `${d2Formatter(token.div(M), "0.00")}M`;
    if (token.gte(K)) return `${d2Formatter(token, "0.00")}`;
  }

  const lowestThreshold = big(10).pow(-(decimalPoints ?? precision));

  if (!token.eq(0) && token.lt(lowestThreshold)) {
    return `<${lowestThreshold.toFixed()}`;
  }

  return formatDecimal({
    decimalPoints: decimalPoints ?? precision,
    delimiter: true,
    hasTrailingZeros,
  })(token, INVALID);
};

/**
 * @remarks
 * Condition for price rendering
 * $0 or >= $1 -> 2d
 * < $1 -> 6d
 * <$0.000001 -> <$0.000001
 */
export const formatPrice = (value: USD<BigSource>): string => {
  try {
    const price = big(value);
    const lowestThreshold = 0.000001;

    const d2 = d2Formatter(price, "0.00");
    const d6 = d6Formatter(price, "0.00");

    if (price.lt(0)) return INVALID;

    if (price.eq(0) || price.gte(1)) {
      return `$${d2}`;
    }

    if (price.lt(lowestThreshold)) {
      return `<$${lowestThreshold}`;
    }
    return `$${d6}`;
  } catch {
    return INVALID;
  }
};

export const formatInteger = (n: BigSource): string => {
  const formatter = formatDecimal({ decimalPoints: 0, delimiter: true });
  return formatter(n, INVALID);
};
