import { Flex, Text } from "@chakra-ui/react";

import type { ComputedUptime, Ratio } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

const LegendItem = ({
  color,
  label,
  ratio,
  value,
}: {
  color: string;
  label: string;
  ratio: Ratio<number>;
  value: number;
}) => (
  <Flex gap={2} w="full">
    <Flex h={3} mt={1} w={3} backgroundColor={color} borderRadius="2px" />
    <Flex
      alignItems={{ base: "center", md: "start" }}
      direction={{ base: "row", md: "column" }}
    >
      <Text
        variant="body2"
        w={{ base: 40, md: "auto" }}
        color="text.dark"
        fontWeight={700}
      >
        {label}
      </Text>
      <Text
        variant={{ base: "body2", md: "body1" }}
        w={{ base: 12, md: "auto" }}
        color="text.main"
        fontWeight={700}
      >
        {value}
      </Text>
      <Text variant="body3" color="text.dark">
        {formatPrettyPercent(ratio)}
      </Text>
    </Flex>
  </Flex>
);

interface RecentBlocksLegendsProps {
  uptime: ComputedUptime;
}

export const RecentBlocksLegends = ({
  uptime: { missed, missedRatio, proposed, proposedRatio, signed, signedRatio },
}: RecentBlocksLegendsProps) => (
  <Flex direction={{ base: "column", md: "row" }}>
    <LegendItem
      label="Signed Blocks"
      value={signed}
      color="recentBlocks.signed"
      ratio={signedRatio}
    />
    <LegendItem
      label="Proposed Blocks"
      value={proposed}
      color="recentBlocks.proposed"
      ratio={proposedRatio}
    />
    <LegendItem
      label="Missed Blocks"
      value={missed}
      color="recentBlocks.missed"
      ratio={missedRatio}
    />
  </Flex>
);
