import type { Coin } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatTokenWithPrecision } from "./token";
import { getTokenLabel } from "./tokenType";

interface FormatBalanceWithDenom {
  coin: Coin;
  symbol?: string;
  precision?: number;
}

export const formatBalanceWithDenom = ({
  coin,
  symbol,
  precision,
}: FormatBalanceWithDenom) => {
  return `${formatTokenWithPrecision(
    coin.amount as U<Token>,
    precision || 0
  )} ${getTokenLabel(symbol || coin.denom)}`;
};
