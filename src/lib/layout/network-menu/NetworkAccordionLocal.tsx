import type { Option } from "lib/types";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";

import { NetworkCard } from "./network-card";

interface NetworkAccordionLocalProps {
  cursor: Option<number>;
  networks: string[];
  onClose: () => void;
  setCursor: (index: Option<number>) => void;
  startIndex: number;
}

export const NetworkAccordionLocal = ({
  cursor,
  networks,
  onClose,
  setCursor,
  startIndex,
}: NetworkAccordionLocalProps) => (
  <AccordionItem hidden={networks.length === 0}>
    <Flex direction="column" gap={4}>
      <AccordionButton p={0}>
        <Flex justifyContent="space-between" w="full">
          <Heading as="h6" variant="h6">
            Your local rollups
          </Heading>
          <AccordionIcon color="gray.600" />
        </Flex>
      </AccordionButton>
      <AccordionPanel p={0}>
        <Flex direction="column" gap={4}>
          {networks.map((chainId, index) => (
            <NetworkCard
              key={chainId}
              chainId={chainId}
              cursor={cursor}
              index={startIndex + index}
              setCursor={setCursor}
              onClose={onClose}
            />
          ))}
        </Flex>
      </AccordionPanel>
    </Flex>
  </AccordionItem>
);
