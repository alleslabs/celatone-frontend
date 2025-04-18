import type { Proposal } from "lib/types";
import type { CSSProperties } from "react";

import { Tag } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";

const getBgColor = (
  status: Proposal["status"]
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return "proposalChip.depositPeriod.bg";
    case ProposalStatus.VOTING_PERIOD:
      return "proposalChip.votingPeriod.bg";
    case ProposalStatus.FAILED:
      return "proposalChip.failed.bg";
    case ProposalStatus.REJECTED:
      return "proposalChip.rejected.bg";
    case ProposalStatus.PASSED:
      return "proposalChip.passed.bg";
    case ProposalStatus.CANCELLED:
      return "proposalChip.cancelled.bg";
    case ProposalStatus.DEPOSIT_FAILED:
    default:
      return "proposalChip.depositFailed.bg";
  }
};

export const StatusChip = ({
  hasCloseBtn = false,
  isTransparent = false,
  status,
}: {
  status: Proposal["status"];
  isTransparent?: boolean;
  hasCloseBtn?: boolean;
}) => {
  const formatStatus =
    status === ProposalStatus.DEPOSIT_FAILED
      ? "Deposit failed"
      : status.replace(/([A-Z])/g, " $1").trim();
  return (
    <Tag
      bgColor={isTransparent ? "transparent" : getBgColor(status)}
      border="1px solid"
      borderColor={getBgColor(status)}
    >
      {formatStatus}
      {hasCloseBtn && <CustomIcon boxSize={3} mr={0} name="close" />}
    </Tag>
  );
};
