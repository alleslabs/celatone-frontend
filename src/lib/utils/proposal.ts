import type { Coin } from "@cosmjs/stargate";

import type { MinDeposit } from "lib/services/wasm/proposal";
import { big } from "lib/types";
import type { Option } from "lib/types";

import { d2Formatter } from "./formatter";

export const getAmountToVote = (
  initialDeposit: Coin,
  minDeposit: Option<MinDeposit>
) => {
  const minDepositAmount = big(minDeposit?.formattedAmount || 0);

  return minDepositAmount.lte(initialDeposit.amount)
    ? null
    : `${d2Formatter(
        minDepositAmount.minus(initialDeposit.amount),
        "NaN"
      )} ${minDeposit?.formattedDenom}`;
};
