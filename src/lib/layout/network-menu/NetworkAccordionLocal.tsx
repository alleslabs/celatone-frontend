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
    <Flex gap={4} direction="column">
      <AccordionButton p={0}>
        <Flex w="full" justifyContent="space-between">
          <Heading as="h6" variant="h6">
            Your Local Minitias
          </Heading>
          <AccordionIcon color="gray.600" />
        </Flex>
      </AccordionButton>
      <AccordionPanel p={0}>
        <Flex gap={4} direction="column">
          {networks.map((chainId, index) => (
            <NetworkCard
              key={chainId}
              chainId={chainId}
              index={startIndex + index}
              cursor={cursor}
              onClose={onClose}
              setCursor={setCursor}
            />
          ))}
        </Flex>
      </AccordionPanel>
    </Flex>
  </AccordionItem>
);
