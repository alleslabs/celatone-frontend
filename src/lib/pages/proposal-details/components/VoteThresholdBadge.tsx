import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";

import { PeriodState } from "../types";
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
        bgColor="gray.700"
        state={PeriodState.ONGOING}
        text="In progress"
      />
    );

  return isCompact ? (
    <CustomIcon color="success.main" m={0} name="check-circle-solid" />
  ) : (
    <ProgressBadge
      bgColor="gray.700"
      state={PeriodState.COMPLETE}
      text="Ended"
    />
  );
};
