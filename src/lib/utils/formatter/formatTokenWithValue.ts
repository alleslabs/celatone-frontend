import type { TokenWithValue } from "lib/types";

import { formatUTokenWithPrecision } from "./token";
import { getTokenLabel } from "./tokenType";

export const formatTokenWithValue = ({
  decimalPoints,
  hasTrailingZeros,
  isEvm,
  token,
}: {
  decimalPoints?: number;
  hasTrailingZeros?: boolean;
  isEvm: boolean;
  token: TokenWithValue;
}) =>
  `${formatUTokenWithPrecision({
    amount: token.amount,
    decimalPoints,
    hasTrailingZeros,
    isEvm,
    isSuffix: false,
    precision: token.precision ?? 0,
  })} ${getTokenLabel(token.denom, token.symbol)}`;

export const formatTokenWithValueList = (
  tokens: TokenWithValue[],
  isEvm: boolean
) => {
  if (tokens.length <= 2)
    return tokens
      .map((token) => formatTokenWithValue({ decimalPoints: 2, isEvm, token }))
      .join(" and ");

  return `${tokens
    .slice(0, -1)
    .map((token) => formatTokenWithValue({ decimalPoints: 2, isEvm, token }))
    .join(
      ", "
    )}, and ${formatTokenWithValue({ decimalPoints: 2, isEvm, token: tokens[tokens.length - 1] })}`;
};
