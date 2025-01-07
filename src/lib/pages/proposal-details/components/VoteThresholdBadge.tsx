import { PeriodState } from "../types";
import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";

import { ProgressBadge } from "./ProgressBadge";

interface VoteThresholdBadgeProps {
  isCompact: boolean;
  status: ProposalStatus;
}

export const VoteThresholdBadge = ({
  isCompact,
  status,
}: VoteThresholdBadgeProps) => {
  if (status === ProposalStatus.VOTING_PERIOD)
    return isCompact ? (
      <ActiveDot />
    ) : (
      <ProgressBadge
        state={PeriodState.ONGOING}
        text="In Progress"
        bgColor="gray.700"
      />
    );

  return isCompact ? (
    <CustomIcon m={0} name="check-circle-solid" color="success.main" />
  ) : (
    <ProgressBadge
      state={PeriodState.COMPLETE}
      text="Ended"
      bgColor="gray.700"
    />
  );
};
