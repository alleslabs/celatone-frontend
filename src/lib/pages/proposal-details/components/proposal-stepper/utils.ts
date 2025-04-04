import { isNull } from "lodash";

import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";
import { PeriodState } from "../../types";
import type { ProgressBadgeProps } from "../ProgressBadge";

export const getProgressBadgeProps = (
  step: number,
  proposalData: ProposalData
): ProgressBadgeProps => {
  // Deposit Period
  if (step === 1) {
    if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
      return { state: PeriodState.FAILED, text: "Not enough deposit" };

    if (
      proposalData.status === ProposalStatus.CANCELLED &&
      isNull(proposalData.votingTime)
    )
      return { state: PeriodState.FAILED, text: "Cancelled" };

    if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
      return { state: PeriodState.ONGOING, text: "In progress" };

    return { state: PeriodState.COMPLETE, text: "Completed" };
  }

  // Voting Period
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return { state: PeriodState.WAITING, text: "Waiting for deposit" };

  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return { state: PeriodState.FAILED, text: "Not enough deposit" };

  if (proposalData.status === ProposalStatus.CANCELLED)
    return { state: PeriodState.FAILED, text: "Cancelled" };

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return { state: PeriodState.ONGOING, text: "In progress" };

  return { state: PeriodState.COMPLETE, text: "Ended" };
};
