import type { TokenWithValue } from "lib/types";

import { formatUTokenWithPrecision } from "./token";
import { getTokenLabel } from "./tokenType";

export const formatTokenWithValue = (
  token: TokenWithValue,
  decimalPoints?: number,
  hasTrailingZeros?: boolean
) =>
  `${formatUTokenWithPrecision(
    token.amount,
    token.precision ?? 0,
    false,
    decimalPoints,
    hasTrailingZeros
  )} ${getTokenLabel(token.denom, token.symbol)}`;

export const formatTokenWithValueInGwei = (
  token: TokenWithValue,
  decimalPoints?: number,
  hasTrailingZeros?: boolean
) =>
  `${formatUTokenWithPrecision(
    token.amount,
    9,
    false,
    decimalPoints,
    hasTrailingZeros
  )} Gwei`;

export const formatTokenWithValueList = (tokens: TokenWithValue[]) => {
  if (tokens.length <= 2)
    return tokens.map((token) => formatTokenWithValue(token, 2)).join(" and ");

  return `${tokens
    .slice(0, -1)
    .map((token) => formatTokenWithValue(token, 2))
    .join(", ")}, and ${formatTokenWithValue(tokens[tokens.length - 1], 2)}`;
};
