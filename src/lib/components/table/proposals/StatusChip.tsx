import { Tag } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import { CURR_THEME } from "env";
import { CustomIcon } from "lib/components/icon";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

const getBgColor = (
  status: Proposal["status"]
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return CURR_THEME.proposalChip.depositPeriod.bg;
    case ProposalStatus.VOTING_PERIOD:
      return CURR_THEME.proposalChip.votingPeriod.bg;
    case ProposalStatus.FAILED:
      return CURR_THEME.proposalChip.failed.bg;
    case ProposalStatus.REJECTED:
      return CURR_THEME.proposalChip.rejected.bg;
    case ProposalStatus.PASSED:
      return CURR_THEME.proposalChip.passed.bg;
    case ProposalStatus.CANCELLED:
      return CURR_THEME.proposalChip.cancelled.bg;
    case ProposalStatus.DEPOSIT_FAILED:
    default:
      return CURR_THEME.proposalChip.depositFailed.bg;
  }
};

export const StatusChip = ({
  status,
  isTransparent = false,
  hasCloseBtn = false,
}: {
  status: Proposal["status"];
  isTransparent?: boolean;
  hasCloseBtn?: boolean;
}) => {
  const formatStatus =
    status === ProposalStatus.DEPOSIT_FAILED
      ? "Deposit Failed"
      : status.replace(/([A-Z])/g, " $1").trim();
  return (
    <Tag
      border="1px solid"
      borderColor={getBgColor(status)}
      bgColor={isTransparent ? "transparent" : getBgColor(status)}
    >
      {formatStatus}
      {hasCloseBtn && <CustomIcon name="close" boxSize={3} mr={0} />}
    </Tag>
  );
};
