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
    gap={{ base: 3, lg: 8 }}
    mb={6}
    px={4}
    py={3}
    background="gray.900"
    borderRadius="8px"
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
            type="tx_hash"
            value={data.createdTxHash.toUpperCase()}
            showCopyOnHover
          />
        </InfoItem>
      )}
      {data.proposer && (
        <InfoItem label="Proposer" minW={36}>
          <ExplorerLink
            type="user_address"
            value={data.proposer}
            showCopyOnHover
          />
        </InfoItem>
      )}
    </Flex>
    <Divider
      display={{ base: "none", lg: "flex" }}
      minH="48px"
      color="gray.700"
      orientation="vertical"
    />
    <TimeInfoItem data={data} />
  </Flex>
);
