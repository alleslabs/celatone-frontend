import type { Coin } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatUTokenWithPrecision } from "./token";
import { getTokenLabel } from "./tokenType";

interface FormatBalanceWithDenom {
  coin: Coin;
  symbol?: string;
  precision?: number;
  decimalPoints?: number;
}

export const formatBalanceWithDenom = ({
  coin,
  symbol,
  precision,
  decimalPoints,
}: FormatBalanceWithDenom) =>
  `${formatUTokenWithPrecision(
    coin.amount as U<Token>,
    precision || 0,
    false,
    decimalPoints
  )} ${getTokenLabel(coin.denom, symbol)}`;
