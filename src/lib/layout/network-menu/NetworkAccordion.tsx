import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";
import type { Option } from "lib/types";

import { NetworkSubsection } from "./NetworkSubsection";

interface NetworkAccordionProps {
  title: string;
  networks: string[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  startIndex: number;
  onClose: () => void;
}

export const NetworkAccordion = ({
  title,
  networks,
  cursor,
  setCursor,
  startIndex,
  onClose,
}: NetworkAccordionProps) => {
  const nonInitiaNetworks = networks.filter(
    (chainId) => CHAIN_CONFIGS[chainId]?.extra.layer === undefined
  );
  const l1Networks = networks.filter(
    (chainId) => CHAIN_CONFIGS[chainId]?.extra.layer === "1"
  );
  const l2Networks = networks.filter(
    (chainId) => CHAIN_CONFIGS[chainId]?.extra.layer === "2"
  );

  return (
    <AccordionItem hidden={networks.length === 0}>
      <AccordionButton p={0}>
        <Flex justifyContent="space-between" w="full" mb={4}>
          <Heading as="h6" variant="h6">
            {title}
          </Heading>
          <AccordionIcon color="gray.600" />
        </Flex>
      </AccordionButton>
      <AccordionPanel p={0}>
        <NetworkSubsection
          networks={nonInitiaNetworks}
          cursor={cursor}
          setCursor={setCursor}
          subsectionStartIndex={startIndex}
          onClose={onClose}
        />
        {l1Networks.length > 0 && (
          <NetworkSubsection
            title="Initia (Layer 1)"
            networks={l1Networks}
            cursor={cursor}
            setCursor={setCursor}
            subsectionStartIndex={startIndex + nonInitiaNetworks.length}
            onClose={onClose}
          />
        )}
        {l2Networks.length > 0 && (
          <NetworkSubsection
            title="Minitia (Layer 2)"
            networks={l2Networks}
            cursor={cursor}
            setCursor={setCursor}
            subsectionStartIndex={
              startIndex + nonInitiaNetworks.length + l1Networks.length
            }
            onClose={onClose}
          />
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};
