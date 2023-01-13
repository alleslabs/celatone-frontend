import type { BigSource } from "big.js";
import big, { Big } from "big.js";
import numeral from "numeral";

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
      .toFixed();

    if (num === "NaN") return fallbackValue;

    const [i, d] = num.split(".");

    const ii = delimiter ? numeral(i).format("0,0") : i;
    const dd = d ? `.${d}` : "";

    return (ii === "0" && num[0] === "-" ? "-" : "") + ii + dd;
  };

const d6Formatter = formatDemimal({ decimalPoints: 6, delimiter: true });

export const formatToken = (amount: string, precision: number): string => {
  const divider = Big(10).pow(precision);
  const amountToInt = new Big(amount);
  return d6Formatter(amountToInt.div(divider), "0");
};
