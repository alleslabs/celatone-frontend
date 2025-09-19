import type { TokenWithValue } from "lib/types";

import { formatUTokenWithPrecision } from "./token";
import { getTokenLabel } from "./tokenType";

export const formatTokenWithValue = ({
  decimalPoints,
  token,
}: {
  decimalPoints?: number;
  token: TokenWithValue;
}) =>
  `${formatUTokenWithPrecision({
    amount: token.amount,
    decimalPoints,
    isSuffix: false,
    precision: token.precision ?? 0,
  })} ${getTokenLabel(token.denom, token.symbol)}`;

export const formatTokenWithValueInGwei = (
  token: TokenWithValue,
  decimalPoints?: number
) =>
  `${formatUTokenWithPrecision({
    amount: token.amount,
    decimalPoints,
    isSuffix: false,
    precision: 9,
  })} Gwei`;

export const formatTokenWithValueList = (tokens: TokenWithValue[]) => {
  if (tokens.length <= 2)
    return tokens
      .map((token) => formatTokenWithValue({ decimalPoints: 2, token }))
      .join(" and ");

  return `${tokens
    .slice(0, -1)
    .map((token) => formatTokenWithValue({ decimalPoints: 2, token }))
    .join(
      ", "
    )}, and ${formatTokenWithValue({ decimalPoints: 2, token: tokens[tokens.length - 1] })}`;
};
