import { Badge, Flex, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";

import { NetworkCard } from "./network-card";

interface NetworkAccordionSubsectionProps {
  title?: string;
  networks: string[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  subsectionStartIndex: number;
  onClose: () => void;
}

export const NetworkAccordionSubsection = ({
  title,
  networks,
  cursor,
  setCursor,
  subsectionStartIndex,
  onClose,
}: NetworkAccordionSubsectionProps) => (
  <Flex direction="column" gap={2}>
    {title !== undefined && (
      <Flex alignItems="center">
        <Text color="text.dark" fontWeight={600} variant="body2">
          {title}
        </Text>
        <Badge variant="gray" ml={2}>
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
        setCursor={setCursor}
        onClose={onClose}
      />
    ))}
  </Flex>
);
