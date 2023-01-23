import type { StdFee } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";

import { formatUToken } from "./currency.format";
import { getTokenLabel } from "./tokenType";

export const formatUFee = (uFee: string) => {
  const regex = /([0-9]+)|([a-zA-Z]+)/g;
  const [fee, denom] = uFee.match(regex) as RegExpMatchArray;
  return `${formatUToken(fee as U<Token>)} ${getTokenLabel(denom)}`;
};

export const formatStdFee = (fee: StdFee) => {
  return `${formatUToken(fee.amount[0].amount as U<Token>)} ${getTokenLabel(
    fee.amount[0].denom
  )}`;
};
