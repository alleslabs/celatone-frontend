import type { CSSProperties } from "react";

import { Flex, Text } from "@chakra-ui/react";
import { useGovConfig } from "lib/app-provider";
import { ActiveDot } from "lib/components/ActiveDot";
import { StatusChip } from "lib/components/table";
import { ProposalStatus } from "lib/types";

import type { ProposalOverviewProps } from "..";

import { ResultExplanation } from "../../ResultExplanation";
import { SummaryStatusChip } from "./SummaryStatusChip";
import { SummaryStatusTime } from "./SummaryStatusTime";

const getStatusSummaryBorderColor = (
  status: ProposalStatus
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.CANCELLED:
      return "error.background";
    case ProposalStatus.DEPOSIT_PERIOD:
      return "primary.dark";
    case ProposalStatus.FAILED:
    case ProposalStatus.REJECTED:
      return "error.dark";
    case ProposalStatus.PASSED:
      return "success.dark";
    case ProposalStatus.VOTING_PERIOD:
      return "secondary.dark";
    case ProposalStatus.DEPOSIT_FAILED:
    default:
      return "gray.700";
  }
};

export const StatusSummary = ({
  proposalData,
  ...props
}: ProposalOverviewProps) => {
  const gov = useGovConfig({ shouldRedirect: false });
  const disableVotingPeriodTally = gov.enabled && gov.disableVotingPeriodTally;
  const isDepositOrVoting =
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposalData.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Flex
      bgColor="gray.900"
      border="1px solid"
      borderColor={getStatusSummaryBorderColor(proposalData.status)}
      borderRadius="8px"
      direction="column"
      gap={2}
      p={4}
    >
      <Flex
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        w="full"
      >
        <Flex align="center" gap={2} whiteSpace="nowrap">
          {isDepositOrVoting && <ActiveDot />}
          {disableVotingPeriodTally &&
          proposalData.status === ProposalStatus.VOTING_PERIOD ? (
            <>
              <Text fontWeight={700} textColor="text.main" variant="body1">
                Current proposal status:
              </Text>
              <StatusChip status={ProposalStatus.VOTING_PERIOD} />
            </>
          ) : (
            <>
              <Text fontWeight={700} textColor="text.main" variant="body1">
                {isDepositOrVoting ? "Current" : "Final"} proposal result:
              </Text>
              <SummaryStatusChip proposalData={proposalData} {...props} />
            </>
          )}
        </Flex>
        <SummaryStatusTime proposalData={proposalData} />
      </Flex>
      <ResultExplanation proposalData={proposalData} {...props} />
    </Flex>
  );
};
