import type { StdFee } from "@cosmjs/stargate";

import { truncate } from "../truncate";
import type { Fee, Token, U } from "lib/types";

import { formatToken } from "./currency.format";

// NOTE: revisit this if some chain is not using "u"denom
const getTokenLabelByDenom = (denom: string) => {
  if (denom[0] === "u") {
    return denom.replace("u", "").toUpperCase();
  }
  const splitId = denom.split("/");
  if (splitId[1]) {
    splitId[1] = truncate(splitId[1]);
  }
  return splitId.length === 1 ? denom : splitId.join("/");
};

export const formatUFee = (uFee: string) => {
  const regex = /([0-9]+)|([a-zA-Z]+)/g;
  const [fee, denom] = uFee.match(regex) as RegExpMatchArray;
  return `${formatToken(fee as U<Token>, denom)} ${getTokenLabelByDenom(
    denom
  )}`;
};

export const formatStdFee = (fee: StdFee | Fee) => {
  return `${formatToken(
    fee.amount[0].amount as U<Token>,
    fee.amount[0].denom
  )} ${getTokenLabelByDenom(fee.amount[0].denom)}`;
};
