import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { useChainConfigs } from "lib/app-provider";
import type { Option } from "lib/types";

import { NetworkAccordionSubsection } from "./NetworkAccordionSubsection";

interface NetworkAccordionProps {
  title: string;
  networks: string[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  startIndex: number;
  onClose: () => void;
}

export const NetworkAccordion = observer(
  ({
    title,
    networks,
    cursor,
    setCursor,
    startIndex,
    onClose,
  }: NetworkAccordionProps) => {
    const { chainConfigs } = useChainConfigs();
    const nonInitiaNetworks = networks.filter(
      (chainId) => chainConfigs[chainId]?.extra.layer === undefined
    );
    const l1Networks = networks.filter(
      (chainId) => chainConfigs[chainId]?.extra.layer === "1"
    );
    const l2Networks = networks.filter(
      (chainId) => chainConfigs[chainId]?.extra.layer === "2"
    );

    return (
      <AccordionItem hidden={networks.length === 0}>
        <Flex direction="column" gap={4}>
          <AccordionButton p={0}>
            <Flex justifyContent="space-between" w="full">
              <Heading as="h6" variant="h6">
                {title}
              </Heading>
              <AccordionIcon color="gray.600" />
            </Flex>
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex direction="column" gap={4}>
              {nonInitiaNetworks.length > 0 && (
                <NetworkAccordionSubsection
                  networks={nonInitiaNetworks}
                  cursor={cursor}
                  setCursor={setCursor}
                  subsectionStartIndex={startIndex}
                  onClose={onClose}
                />
              )}
              {l1Networks.length > 0 && (
                <NetworkAccordionSubsection
                  title="Initia (Layer 1)"
                  networks={l1Networks}
                  cursor={cursor}
                  setCursor={setCursor}
                  subsectionStartIndex={startIndex + nonInitiaNetworks.length}
                  onClose={onClose}
                />
              )}
              {l2Networks.length > 0 && (
                <NetworkAccordionSubsection
                  title="Rollup (Layer 2)"
                  networks={l2Networks}
                  cursor={cursor}
                  setCursor={setCursor}
                  subsectionStartIndex={
                    startIndex + nonInitiaNetworks.length + l1Networks.length
                  }
                  onClose={onClose}
                />
              )}
            </Flex>
          </AccordionPanel>
        </Flex>
      </AccordionItem>
    );
  }
);
