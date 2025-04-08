import type { ProposalData } from "lib/types";

import { Divider, Flex } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { StatusChip } from "lib/components/table";

import { InfoItem } from "./InfoItem";
import { TimeInfoItem } from "./TimeInfoItem";

interface ProposalStatusProps {
  data: ProposalData;
}

export const ProposalInfo = ({ data }: ProposalStatusProps) => (
  <Flex
    background="gray.900"
    borderRadius="8px"
    direction={{ base: "column", lg: "row" }}
    gap={{ base: 3, lg: 8 }}
    mb={6}
    px={4}
    py={3}
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
            showCopyOnHover
            type="tx_hash"
            value={data.createdTxHash.toUpperCase()}
          />
        </InfoItem>
      )}
      {data.proposer && (
        <InfoItem label="Proposer" minW={36}>
          <ExplorerLink
            showCopyOnHover
            type="user_address"
            value={data.proposer}
          />
        </InfoItem>
      )}
    </Flex>
    <Divider
      color="gray.700"
      display={{ base: "none", lg: "flex" }}
      minH="48px"
      orientation="vertical"
    />
    <TimeInfoItem data={data} />
  </Flex>
);
