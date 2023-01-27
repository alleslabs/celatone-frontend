import type { Coin } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatToken } from "./currency.format";
import { getTokenLabel } from "./tokenType";

interface FormatBalanceWithDenom {
  coin: Coin;
  symbol?: string;
}

export const formatBalanceWithDenom = ({
  coin,
  symbol,
}: FormatBalanceWithDenom) => {
  return `${formatToken(coin.amount as U<Token>, coin.denom)} ${getTokenLabel(
    symbol || coin.denom
  )}`;
};
