import { Tag } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import { CustomIcon } from "lib/components/icon";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";

const getBgColor = (
  status: Proposal["status"]
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return "secondary.darker";
    case ProposalStatus.VOTING_PERIOD:
      return "primary.dark";
    case ProposalStatus.FAILED:
    case ProposalStatus.REJECTED:
      return "error.dark";
    case ProposalStatus.PASSED:
      return "success.dark";
    case ProposalStatus.CANCELLED:
      return "error.background";
    case ProposalStatus.DEPOSIT_FAILED:
    default:
      return "gray.700";
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
