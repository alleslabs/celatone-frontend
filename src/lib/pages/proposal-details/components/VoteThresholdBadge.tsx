import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";

import { ActiveDot } from "./ActiveDot";
import { BadgeState, ProgressBadge } from "./ProgressBadge";

interface VoteThresholdBadgeProps {
  status: ProposalStatus;
  isCompact: boolean;
}

export const VoteThresholdBadge = ({
  status,
  isCompact,
}: VoteThresholdBadgeProps) => {
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
    <CustomIcon m={0} name="check-circle-solid" color="success.main" />
  ) : (
    <ProgressBadge
      state={BadgeState.COMPLETE}
      text="Quorum Reached"
      bgColor="gray.700"
    />
  );
};
