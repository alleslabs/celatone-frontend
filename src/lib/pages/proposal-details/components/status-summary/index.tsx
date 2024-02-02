import { Flex, Text } from "@chakra-ui/react";

import type { ProposalOverviewProps } from "../ProposalOverview";
import { StatusChip } from "lib/components/table";
import { ProposalStatus } from "lib/types";

import { ActiveDot } from "./ActiveDot";

export const StatusSummary = ({ proposalData }: ProposalOverviewProps) => {
  return (
    <Flex
      p={4}
      bgColor="gray.900"
      border={
        proposalData.status === ProposalStatus.VOTING_PERIOD
          ? "1px solid var(--chakra-colors-accent-main)"
          : undefined
      }
      borderRadius="8px"
    >
      <Flex align="center" gap={2}>
        <ActiveDot status={proposalData.status} />
        <Text variant="body1" textColor="text.main" fontWeight={700}>
          Current proposal result:
        </Text>
        <StatusChip status={proposalData.status} />
      </Flex>
    </Flex>
  );
};
