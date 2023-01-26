import type { Coin } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatToken } from "./currency.format";
import { getTokenLabel } from "./tokenType";

export const formatBalanceWithDenom = (coin: Coin) => {
  return `${formatToken(coin.amount as U<Token>, coin.denom)} ${getTokenLabel(
    coin.denom
  )}`;
};

export const formatBalanceWithDenomList = (coins: Coin[]) =>
  coins.map(formatBalanceWithDenom);
