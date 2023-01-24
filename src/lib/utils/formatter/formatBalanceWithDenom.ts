import type { Coin } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatToken } from "./currency.format";
import { getTokenLabel } from "./tokenType";

export const formatBalanceWithDenom = (coins: Coin[]) =>
  coins.map((amount) => {
    let amountFormat = amount.amount;
    if (amount.denom[0] === "u") {
      amountFormat = formatToken(amount.amount as U<Token>, amount.denom);
    }
    return `${amountFormat} ${getTokenLabel(amount.denom)}`;
  });
