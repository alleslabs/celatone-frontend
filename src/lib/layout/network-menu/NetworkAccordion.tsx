import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";
import type { Option } from "lib/types";

import { NetworkCard } from "./NetworkCard";

interface NetworkAccodionProps {
  title: string;
  normalNetworks: string[];
  currentChainId: string;
  isHidden?: boolean;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  startIndex: number;
  onClose: () => void;
}

interface SectionTitleProps {
  networks: string[];
  title: string;
  mb?: number;
}

const SectionTitle = ({ networks, title, mb = 4 }: SectionTitleProps) => (
  <Flex alignItems="center" mb={mb}>
    <Text color="text.dark" fontWeight={600} variant="body2">
      {title}
    </Text>
    <Badge variant="gray" ml={2}>
      {networks.length}
    </Badge>
  </Flex>
);

export const NetworkAccodion = ({
  title,
  normalNetworks,
  currentChainId,
  isHidden = false,
  cursor,
  setCursor,
  startIndex,
  onClose,
}: NetworkAccodionProps) => {
  const nonInitiaNetworks = normalNetworks.filter(
    (chainId) => CHAIN_CONFIGS[chainId]?.extra.layer === undefined
  );
  const l1Networks = normalNetworks.filter(
    (chainId) => CHAIN_CONFIGS[chainId]?.extra.layer === "1"
  );
  const l2Networks = normalNetworks.filter(
    (chainId) => CHAIN_CONFIGS[chainId]?.extra.layer === "2"
  );

  return (
    <AccordionItem hidden={isHidden}>
      <AccordionButton p={0}>
        <Flex justifyContent="space-between" w="full" mb={4}>
          <Heading as="h6" variant="h6">
            {title}
          </Heading>
          <AccordionIcon color="gray.600" />
        </Flex>
      </AccordionButton>
      <AccordionPanel p={0}>
        <Flex direction="column" gap={1} mb={4}>
          {nonInitiaNetworks.map((chainId, index) => (
            <NetworkCard
              key={chainId}
              image={CHAIN_CONFIGS[chainId]?.logoUrl}
              chainId={chainId}
              isSelected={chainId === currentChainId}
              index={startIndex + index}
              cursor={cursor}
              setCursor={setCursor}
              onClose={onClose}
            />
          ))}
        </Flex>
        {l1Networks.length > 0 && (
          <Flex direction="column" gap={1} mb={4}>
            <SectionTitle networks={l1Networks} title="Initia (Layer 1)" />
            {l1Networks.map((chainId, index) => (
              <NetworkCard
                key={chainId}
                image={CHAIN_CONFIGS[chainId]?.logoUrl}
                chainId={chainId}
                isSelected={chainId === currentChainId}
                index={startIndex + nonInitiaNetworks.length + index}
                cursor={cursor}
                setCursor={setCursor}
                onClose={onClose}
              />
            ))}
          </Flex>
        )}
        {l2Networks.length > 0 && (
          <Flex direction="column" gap={1} mb={4}>
            <SectionTitle networks={l2Networks} title="Minitia (Layer 2)" />
            {l2Networks.map((chainId, index) => (
              <NetworkCard
                key={chainId}
                image={CHAIN_CONFIGS[chainId]?.logoUrl}
                chainId={chainId}
                isSelected={chainId === currentChainId}
                index={
                  startIndex +
                  nonInitiaNetworks.length +
                  l1Networks.length +
                  index
                }
                cursor={cursor}
                setCursor={setCursor}
                onClose={onClose}
              />
            ))}
          </Flex>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};
