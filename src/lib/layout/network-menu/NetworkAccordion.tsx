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
  cursor: Option<number>;
  networks: string[];
  onClose: () => void;
  setCursor: (index: Option<number>) => void;
  startIndex: number;
  title: string;
}

export const NetworkAccordion = observer(
  ({
    cursor,
    networks,
    onClose,
    setCursor,
    startIndex,
    title,
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
        <Flex gap={4} direction="column">
          <AccordionButton p={0}>
            <Flex w="full" justifyContent="space-between">
              <Heading as="h6" variant="h6">
                {title}
              </Heading>
              <AccordionIcon color="gray.600" />
            </Flex>
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex gap={4} direction="column">
              {nonInitiaNetworks.length > 0 && (
                <NetworkAccordionSubsection
                  cursor={cursor}
                  networks={nonInitiaNetworks}
                  onClose={onClose}
                  setCursor={setCursor}
                  subsectionStartIndex={startIndex}
                />
              )}
              {l1Networks.length > 0 && (
                <NetworkAccordionSubsection
                  title="Initia (Layer 1)"
                  cursor={cursor}
                  networks={l1Networks}
                  onClose={onClose}
                  setCursor={setCursor}
                  subsectionStartIndex={startIndex + nonInitiaNetworks.length}
                />
              )}
              {l2Networks.length > 0 && (
                <NetworkAccordionSubsection
                  title="Minitia (Layer 2)"
                  cursor={cursor}
                  networks={l2Networks}
                  onClose={onClose}
                  setCursor={setCursor}
                  subsectionStartIndex={
                    startIndex + nonInitiaNetworks.length + l1Networks.length
                  }
                />
              )}
            </Flex>
          </AccordionPanel>
        </Flex>
      </AccordionItem>
    );
  }
);
