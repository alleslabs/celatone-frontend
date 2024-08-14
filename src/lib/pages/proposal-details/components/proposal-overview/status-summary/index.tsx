import { Flex, Text } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import type { ProposalOverviewProps } from "..";
import { ActiveDot } from "../../ActiveDot";
import { ResultExplanation } from "../../ResultExplanation";
import { useGovConfig } from "lib/app-provider";
import { StatusChip } from "lib/components/table";
import { ProposalStatus } from "lib/types";

import { SummaryStatusChip } from "./SummaryStatusChip";
import { SummaryStatusTime } from "./SummaryStatusTime";

const getStatusSummaryBorderColor = (
  status: ProposalStatus
): CSSProperties["backgroundColor"] => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return "primary.dark";
    case ProposalStatus.VOTING_PERIOD:
      return "secondary.dark";
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
      direction="column"
      gap={2}
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
        <Flex align="center" gap={2} whiteSpace="nowrap">
          {isDepositOrVoting && <ActiveDot />}
          {disableVotingPeriodTally &&
          proposalData.status === ProposalStatus.VOTING_PERIOD ? (
            <>
              <Text variant="body1" textColor="text.main" fontWeight={700}>
                Current proposal status:
              </Text>
              <StatusChip status={ProposalStatus.VOTING_PERIOD} />
            </>
          ) : (
            <>
              <Text variant="body1" textColor="text.main" fontWeight={700}>
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
