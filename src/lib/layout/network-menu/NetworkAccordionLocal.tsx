import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";

import type { Option } from "lib/types";

import { NetworkCard } from "./network-card";

interface NetworkAccordionLocalProps {
  networks: string[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  startIndex: number;
  onClose: () => void;
}

export const NetworkAccordionLocal = ({
  networks,
  cursor,
  setCursor,
  startIndex,
  onClose,
}: NetworkAccordionLocalProps) => (
  <AccordionItem hidden={networks.length === 0}>
    <Flex direction="column" gap={4}>
      <AccordionButton p={0}>
        <Flex justifyContent="space-between" w="full">
          <Heading as="h6" variant="h6">
            Your Local Minitias
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
              index={startIndex + index}
              cursor={cursor}
              setCursor={setCursor}
              onClose={onClose}
            />
          ))}
        </Flex>
      </AccordionPanel>
    </Flex>
  </AccordionItem>
);
