import type { Coin } from "@cosmjs/stargate";
import big from "big.js";

import type { MinDeposit } from "lib/services/proposalService";
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
