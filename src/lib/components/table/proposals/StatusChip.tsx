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
    case ProposalStatus.FAILED:
    case ProposalStatus.REJECTED:
      return "error.dark";
    case ProposalStatus.PASSED:
      return "success.dark";
    case ProposalStatus.VOTING_PERIOD:
      return "primary.dark";
    case ProposalStatus.DEPOSIT_FAILED:
    default:
      return "gray.700";
  }
};

export const StatusChip = ({
  status,
  hasCloseBtn = false,
}: {
  status: Proposal["status"];
  hasCloseBtn?: boolean;
}) => {
  const formatStatus = status.replace(/([A-Z])/g, " $1").trim();
  return (
    <Tag bgColor={getBgColor(status)}>
      {formatStatus}
      {hasCloseBtn && <CustomIcon name="close" boxSize="3" mr={0} />}
    </Tag>
  );
};
