import type { StdFee } from "@cosmjs/stargate";

import type { Fee, Token, U } from "lib/types";

import { formatToken } from "./currency.format";
import { getTokenLabel } from "./tokenType";

export const formatUFee = (uFee: string) => {
  const regex = /([0-9]+)|([a-zA-Z]+)/g;
  const [fee, denom] = uFee.match(regex) as RegExpMatchArray;
  return `${formatToken(fee as U<Token>, denom)} ${getTokenLabel(denom)}`;
};

export const formatStdFee = (fee: StdFee | Fee) => {
  return `${formatToken(
    fee.amount[0].amount as U<Token>,
    fee.amount[0].denom
  )} ${getTokenLabel(fee.amount[0].denom)}`;
};
