import { isNull } from "lodash";

import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";
import type { Nullable, Ratio } from "lib/types";
import { ProposalStatus } from "lib/types";

import { ProgressBadge } from "./ProgressBadge";
import { PeriodState } from "../types";

interface VoteQuorumBadgeProps {
  status: ProposalStatus;
  quorum: number;
  totalRatio: Nullable<Ratio<number>>;
  isCompact: boolean;
}

export const VoteQuorumBadge = ({
  status,
  quorum,
  totalRatio,
  isCompact,
}: VoteQuorumBadgeProps) => {
  if (isNull(totalRatio)) return null;

  if (totalRatio >= quorum)
    return isCompact ? (
      <CustomIcon m={0} name="check-circle-solid" color="success.main" />
    ) : (
      <ProgressBadge
        state={PeriodState.COMPLETE}
        text="Quorum reached"
        bgColor="gray.700"
      />
    );

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
    <CustomIcon m={0} name="close-circle-solid" color="error.main" />
  ) : (
    <ProgressBadge
      state={PeriodState.FAILED}
      text="Quorum not reached"
      bgColor="gray.700"
    />
  );
};
