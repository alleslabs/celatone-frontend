import { Divider, Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { StatusChip } from "lib/components/table";
import type { ProposalData } from "lib/types";

import { InfoItem } from "./InfoItem";
import { TimeInfoItem } from "./TimeInfoItem";

interface ProposalStatusProps {
  data: ProposalData;
}

export const ProposalInfo = ({ data }: ProposalStatusProps) => (
  <Flex
    direction={{ base: "column", lg: "row" }}
    gap={{ base: 3, lg: 8 }}
    px={4}
    py={3}
    mb={6}
    borderRadius="8px"
    background="gray.900"
  >
    <InfoItem label="Proposal status">
      <Flex minW="110px">
        <StatusChip status={data.status} />
      </Flex>
    </InfoItem>
    <Flex gap={8}>
      {data.createdTxHash && (
        <InfoItem label="Created tx" minW={36}>
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
    <TimeInfoItem data={data} />
  </Flex>
);
