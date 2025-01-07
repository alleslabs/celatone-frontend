import { Badge, Flex, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";

import { NetworkCard } from "./network-card";

interface NetworkAccordionSubsectionProps {
  cursor: Option<number>;
  networks: string[];
  onClose: () => void;
  setCursor: (index: Option<number>) => void;
  subsectionStartIndex: number;
  title?: string;
}

export const NetworkAccordionSubsection = ({
  cursor,
  networks,
  onClose,
  setCursor,
  subsectionStartIndex,
  title,
}: NetworkAccordionSubsectionProps) => (
  <Flex gap={2} direction="column">
    {title !== undefined && (
      <Flex alignItems="center">
        <Text variant="body2" color="text.dark" fontWeight={600}>
          {title}
        </Text>
        <Badge ml={2} variant="gray">
          {networks.length}
        </Badge>
      </Flex>
    )}
    {networks.map((chainId, index) => (
      <NetworkCard
        key={chainId}
        chainId={chainId}
        index={subsectionStartIndex + index}
        cursor={cursor}
        onClose={onClose}
        setCursor={setCursor}
      />
    ))}
  </Flex>
);
