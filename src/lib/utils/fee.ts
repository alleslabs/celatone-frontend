import type { StdFee } from "@cosmjs/stargate";

import type { Option } from "lib/types";

import { coinsFromStr } from "./funds";

export const feeFromStr = (uFee: Option<string>) => {
  if (!uFee) return undefined;

  const fee: StdFee = {
    amount: coinsFromStr(uFee),
    gas: "0",
  };

  return fee;
};
