import { chakra, Tag } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import type { ContractRelatedProposals } from "lib/types";
import { ProposalStatus } from "lib/types";

const StyledTag = chakra(Tag, {
  baseStyle: {
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 400,
    color: "text.main",
    height: "24px",
    w: "fit-content",
  },
});

const getBgColor = (
  status: ContractRelatedProposals["status"]
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return "#BA863A";
    case ProposalStatus.FAILED:
    case ProposalStatus.REJECTED:
      return "rgba(242, 96, 91, 0.6)";
    case ProposalStatus.PASSED:
      return "rgba(161, 229, 143, 0.5)";
    case ProposalStatus.VOTING_PERIOD:
      return "#0288D1";
    case ProposalStatus.INACTIVE:
    default:
      return "rgba(173, 173, 173, 0.6)";
  }
};

export const StatusChip = ({
  status,
}: {
  status: ContractRelatedProposals["status"];
}) => {
  return <StyledTag bgColor={getBgColor(status)}>{status}</StyledTag>;
};
