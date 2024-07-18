import { Badge, Flex, Text } from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import type { Option } from "lib/types";

import { NetworkCard } from "./NetworkCard";

interface NetworkSubsectionProps {
  title?: string;
  networks: string[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  subsectionStartIndex: number;
  onClose: () => void;
}

export const NetworkSubsection = ({
  title,
  networks,
  cursor,
  setCursor,
  subsectionStartIndex,
  onClose,
}: NetworkSubsectionProps) => {
  const { currentChainId } = useCelatoneApp();

  return (
    <Flex direction="column" gap={1} mb={4}>
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
          image={CHAIN_CONFIGS[chainId]?.logoUrl}
          chainId={chainId}
          isSelected={chainId === currentChainId}
          index={subsectionStartIndex + index}
          cursor={cursor}
          setCursor={setCursor}
          onClose={onClose}
        />
      ))}
    </Flex>
  );
};
