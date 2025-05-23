import type { Nullable, Ratio } from "lib/types";

import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";
import { isNull } from "lodash";

import { PeriodState } from "../types";
import { ProgressBadge } from "./ProgressBadge";

interface VoteQuorumBadgeProps {
  isCompact: boolean;
  quorum: number;
  status: ProposalStatus;
  totalRatio: Nullable<Ratio<number>>;
}

export const VoteQuorumBadge = ({
  isCompact,
  quorum,
  status,
  totalRatio,
}: VoteQuorumBadgeProps) => {
  if (isNull(totalRatio)) return null;

  if (totalRatio >= quorum)
    return isCompact ? (
      <CustomIcon color="success.main" m={0} name="check-circle-solid" />
    ) : (
      <ProgressBadge
        bgColor="gray.700"
        state={PeriodState.COMPLETE}
        text="Quorum reached"
      />
    );

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
    <CustomIcon color="error.main" m={0} name="close-circle-solid" />
  ) : (
    <ProgressBadge
      bgColor="gray.700"
      state={PeriodState.FAILED}
      text="Quorum not reached"
    />
  );
};
