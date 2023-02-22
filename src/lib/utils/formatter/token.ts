import type { BigSource } from "big.js";
import big from "big.js";

import type { Token } from "lib/types";

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

const d6Formatter = formatDemimal({ decimalPoints: 6, delimiter: true });

export const formatTokenWithPrecision = (
  amount: Token<BigSource>,
  precision: number
): string => d6Formatter(big(amount).div(big(10).pow(precision)), "0");
