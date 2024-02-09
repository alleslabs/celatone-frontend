import { BadgeState, type ProgressBadgeProps } from "../ProgressBadge";
import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";

export const getProgressBadgeProps = (
  step: number,
  proposalData: ProposalData
): ProgressBadgeProps => {
  // Deposit Period
  if (step === 1) {
    if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
      return { state: BadgeState.FAILED, text: "Not enough deposit" };

    if (
      proposalData.status === ProposalStatus.CANCELLED &&
      proposalData.votingEndTime === null
    )
      return { state: BadgeState.FAILED, text: "Cancelled" };

    if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
      return { state: BadgeState.ONGOING, text: "In Progress" };

    return { state: BadgeState.COMPLETE, text: "Completed" };
  }

  // Voting Period
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return { state: BadgeState.WAITING, text: "Waiting for deposit" };

  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return { state: BadgeState.FAILED, text: "Not enough deposit" };

  if (proposalData.status === ProposalStatus.CANCELLED)
    return { state: BadgeState.FAILED, text: "Cancelled" };

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return { state: BadgeState.ONGOING, text: "In Progress" };

  return { state: BadgeState.COMPLETE, text: "Vote Ended" };
};

export const getStepperDescription = () => "Placeholder";
