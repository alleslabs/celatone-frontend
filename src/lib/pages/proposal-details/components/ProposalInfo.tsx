import { Divider, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileLabel, StatusChip } from "lib/components/table";
import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

interface InfoItemProps {
  label: string;
  children: ReactNode;
  minW?: number;
}

const InfoItem = ({ label, children, minW = 40 }: InfoItemProps) => (
  <Flex direction="column" gap={1} minW={minW}>
    <MobileLabel label={label} variant="body2" />
    {children}
  </Flex>
);

interface ProposalStatusProps {
  data: ProposalData;
}

const getProposalInfo = (data: ProposalStatusProps["data"]) => {
  switch (data.status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return (
        <InfoItem label="Deposit Start/End">
          <Text variant="body2" color="text.dark">
            {data.submitTime && data.depositEndTime
              ? `${formatUTC(data.submitTime)} - ${formatUTC(data.depositEndTime)}`
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
                showCopyOnHover
              />
            ) : (
              <Text variant="body2" color="text.dark">
                N/A
              </Text>
            )}
          </InfoItem>
          <InfoItem label="Failed at">
            <Text variant="body2" color="text.dark">
              {data.resolvedTimestamp
                ? formatUTC(data.resolvedTimestamp)
                : "N/A"}
            </Text>
          </InfoItem>
        </Flex>
      );
    case ProposalStatus.VOTING_PERIOD:
      return (
        <InfoItem label="Voting Start/End">
          <Text variant="body2" color="text.dark">
            {data.votingTime && data.votingEndTime
              ? `${formatUTC(data.votingTime)} - ${formatUTC(data.votingEndTime)}`
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
                showCopyOnHover
              />
            ) : (
              <Text variant="body2" color="text.dark">
                N/A
              </Text>
            )}
          </InfoItem>
          <InfoItem label="Resolved at">
            <Text variant="body2" color="text.dark">
              {data.resolvedTimestamp
                ? formatUTC(data.resolvedTimestamp)
                : "N/A"}
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

export const ProposalInfo = ({ data }: ProposalStatusProps) => (
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
      {data.createdTxHash && (
        <InfoItem label="Created Tx" minW={36}>
          <ExplorerLink
            value={data.createdTxHash.toUpperCase()}
            type="tx_hash"
            showCopyOnHover
          />
        </InfoItem>
      )}
      {data.proposer && (
        <InfoItem label="Proposer" minW={36}>
          <ExplorerLink
            value={data.proposer}
            type="user_address"
            showCopyOnHover
          />
        </InfoItem>
      )}
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
