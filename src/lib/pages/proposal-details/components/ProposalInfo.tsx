import { Divider, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileLabel, StatusChip } from "lib/components/table";
import type { BechAddr } from "lib/types";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

interface InfoItemProps {
  label: string;
  children: ReactNode;
}

const InfoItem = ({ label, children }: InfoItemProps) => {
  return (
    <Flex direction="column" gap={1}>
      <MobileLabel label={label} variant="body2" />
      {children}
    </Flex>
  );
};

type ProposalData = {
  status: ProposalStatus;
  createdTxHash: string;
  proposer: BechAddr;
  depositStart?: Date;
  depositEnd?: Date;
  voteStart?: Date;
  voteEnd?: Date;
  resolvedHeight?: number;
  resolvedDate?: Date;
};

interface ProposalStatusProps {
  data: ProposalData;
}

const getProposalInfo = (data: ProposalStatusProps["data"]) => {
  switch (data.status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return (
        <InfoItem label="Deposit Start/End">
          <Text variant="body2" color="text.dark">
            {data.depositStart && data.depositEnd
              ? `${formatUTC(data.depositStart)} - ${formatUTC(data.depositEnd)}`
              : "N/A"}
          </Text>
        </InfoItem>
      );
    case ProposalStatus.DEPOSIT_FAILED:
      return (
        <Flex
          gap={{ base: 2, xl: 8 }}
          direction={{ base: "column", xl: "row" }}
        >
          <InfoItem label="Failed at block">
            {data.resolvedHeight ? (
              <ExplorerLink
                value={data.resolvedHeight?.toString()}
                type="block_height"
              />
            ) : (
              <Text variant="body2" color="text.dark">
                N/A
              </Text>
            )}
          </InfoItem>
          <InfoItem label="Failed at">
            <Text variant="body2" color="text.dark">
              {data.resolvedDate ? formatUTC(data.resolvedDate) : "N/A"}
            </Text>
          </InfoItem>
        </Flex>
      );
    case ProposalStatus.VOTING_PERIOD:
      return (
        <InfoItem label="Voting Start/End">
          <Text variant="body2" color="text.dark">
            {data.voteStart && data.voteEnd
              ? `${formatUTC(data.voteStart)} - ${formatUTC(data.voteEnd)}`
              : "N/A"}
          </Text>
        </InfoItem>
      );
    case ProposalStatus.PASSED:
    case ProposalStatus.FAILED:
    case ProposalStatus.REJECTED:
      return (
        <Flex
          gap={{ base: 2, xl: 8 }}
          direction={{ base: "column", xl: "row" }}
        >
          <InfoItem label="Resolved Block Height">
            {data.resolvedHeight ? (
              <ExplorerLink
                value={data.resolvedHeight?.toString()}
                type="block_height"
              />
            ) : (
              <Text variant="body2" color="text.dark">
                N/A
              </Text>
            )}
          </InfoItem>
          <InfoItem label="Resolved at">
            <Text variant="body2" color="text.dark">
              {data.resolvedDate ? formatUTC(data.resolvedDate) : "N/A"}
            </Text>
          </InfoItem>
        </Flex>
      );
    default:
      return (
        <InfoItem label="Proposal Status">
          <Flex>N/A</Flex>
        </InfoItem>
      );
  }
};

export const ProposalInfo = ({ data }: ProposalStatusProps) => {
  return (
    <Flex
      background="gray.900"
      borderRadius="8px"
      px={4}
      py={3}
      gap={{ base: 3, lg: 8 }}
      direction={{ base: "column", lg: "row" }}
    >
      <InfoItem label="Proposal Status">
        <Flex minW="110px">
          <StatusChip status={data.status} />
        </Flex>
      </InfoItem>
      <Flex gap={8}>
        <InfoItem label="Created Tx">
          <ExplorerLink value="B1DE14...32F12A" type="tx_hash" />
        </InfoItem>
        <InfoItem label="Proposer">
          <ExplorerLink value="cltn1...7tlju97" type="user_address" />
        </InfoItem>
      </Flex>
      <Divider
        orientation="vertical"
        color="gray.700"
        minH="48px"
        display={{ base: "none", lg: "flex" }}
      />
      <Flex gap={3}>{getProposalInfo(data)}</Flex>
    </Flex>
  );
};
