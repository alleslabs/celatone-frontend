import type { TokenWithValue } from "lib/types";

import { formatUTokenWithPrecision } from "./token";
import { getTokenLabel } from "./tokenType";

export const formatTokenWithValue = (
  token: TokenWithValue,
  decimalPoints?: number
) =>
  `${formatUTokenWithPrecision(
    token.amount,
    token.precision ?? 0,
    false,
    decimalPoints
  )} ${getTokenLabel(token.denom, token.symbol)}`;
