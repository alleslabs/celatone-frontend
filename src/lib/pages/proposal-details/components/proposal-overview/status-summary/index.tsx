import { Flex, Text } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import type { ProposalOverviewProps } from "..";
import { StatusChip } from "lib/components/table";
import { ProposalStatus } from "lib/types";

import { ActiveDot } from "./ActiveDot";
import { SummaryStatusTime } from "./SummaryStatusTime";

const getStatusSummaryBorderColor = (
  status: ProposalStatus
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return "secondary.darker";
    case ProposalStatus.VOTING_PERIOD:
      return "accent.main";
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

export const StatusSummary = ({ proposalData }: ProposalOverviewProps) => {
  const isOngoing =
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposalData.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Flex
      p={4}
      bgColor="gray.900"
      border="1px solid"
      borderRadius="8px"
      borderColor={getStatusSummaryBorderColor(proposalData.status)}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "start", md: "center" }}
        w="full"
        justify="space-between"
      >
        <Flex align="center" gap={2}>
          <ActiveDot status={proposalData.status} />
          <Text variant="body1" textColor="text.main" fontWeight={700}>
            {isOngoing ? "Current" : "Final"} proposal result:
          </Text>
          <StatusChip status={proposalData.status} />
        </Flex>
        <SummaryStatusTime proposalData={proposalData} />
      </Flex>
    </Flex>
  );
};
