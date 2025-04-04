import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";

import { ProgressBadge } from "./ProgressBadge";
import { PeriodState } from "../types";

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
        state={PeriodState.ONGOING}
        text="In progress"
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
