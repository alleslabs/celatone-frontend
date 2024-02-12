import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";

import { ActiveDot } from "./ActiveDot";
import { BadgeState, ProgressBadge } from "./ProgressBadge";

interface VoteQuorumBadgeProps {
  status: ProposalStatus;
  quorum: number;
  totalVotes: Big;
  isCompact: boolean;
}

export const VoteQuorumBadge = ({
  status,
  quorum,
  totalVotes,
  isCompact,
}: VoteQuorumBadgeProps) => {
  if (totalVotes.gte(quorum))
    return isCompact ? (
      <CustomIcon m={0} name="check-circle-solid" color="success.main" />
    ) : (
      <ProgressBadge
        state={BadgeState.COMPLETE}
        text="Quorum Reached"
        bgColor="gray.700"
      />
    );

  if (status === ProposalStatus.VOTING_PERIOD)
    return isCompact ? (
      <ActiveDot />
    ) : (
      <ProgressBadge
        state={BadgeState.ONGOING}
        text="In Progress"
        bgColor="gray.700"
      />
    );

  return isCompact ? (
    <CustomIcon m={0} name="close-circle-solid" color="error.main" />
  ) : (
    <ProgressBadge
      state={BadgeState.FAILED}
      text="Quorum Not Reached"
      bgColor="gray.700"
    />
  );
};
