import type { Coin } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatUToken } from "./currency.format";
import { formatUDenom } from "./denom";

export const coinToString = (coins: Coin[]) =>
  coins.map(
    (amount) =>
      `${formatUToken(amount.amount as U<Token>)} ${formatUDenom(amount.denom)}`
  );
