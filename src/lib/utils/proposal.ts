import type { Coin } from "@cosmjs/stargate";
import big from "big.js";

import type { MinDeposit } from "lib/services/proposalService";
import type { Option } from "lib/types";
import { ProposalStatus } from "lib/types";

import { d2Formatter } from "./formatter";

export const parseProposalStatus = (status: string): ProposalStatus =>
  status === "Inactive"
    ? ProposalStatus.DEPOSIT_FAILED
    : (status as ProposalStatus);

export const getAmountToVote = (
  initialDeposit: Coin,
  minDeposit: Option<MinDeposit>
) => {
  const minDepositAmount = big(minDeposit?.formattedAmount || 0);

  return minDepositAmount.lte(initialDeposit.amount)
    ? null
    : `${d2Formatter(minDepositAmount.minus(initialDeposit.amount), "NaN")} ${
        minDeposit?.formattedDenom
      }`;
};
