import type { ComputedUptime, Ratio } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { formatPrettyPercent } from "lib/utils";

const LegendItem = ({
  label,
  color,
  value,
  ratio,
}: {
  label: string;
  color: string;
  value: number;
  ratio: Ratio<number>;
}) => (
  <Flex gap={2} w="full">
    <Flex backgroundColor={color} borderRadius="2px" h={3} mt={1} w={3} />
    <Flex
      alignItems={{ base: "center", md: "start" }}
      direction={{ base: "row", md: "column" }}
    >
      <Text
        color="text.dark"
        fontWeight={700}
        variant="body2"
        w={{ base: 40, md: "auto" }}
      >
        {label}
      </Text>
      <Text
        color="text.main"
        fontWeight={700}
        variant={{ base: "body2", md: "body1" }}
        w={{ base: 12, md: "auto" }}
      >
        {value}
      </Text>
      <Text color="text.dark" variant="body3">
        {formatPrettyPercent(ratio)}
      </Text>
    </Flex>
  </Flex>
);

interface RecentBlocksLegendsProps {
  uptime: ComputedUptime;
}

export const RecentBlocksLegends = ({
  uptime: { signed, proposed, missed, signedRatio, proposedRatio, missedRatio },
}: RecentBlocksLegendsProps) => (
  <Flex direction={{ base: "column", md: "row" }}>
    <LegendItem
      label="Signed blocks"
      color="recentBlocks.signed"
      label="Signed Blocks"
      ratio={signedRatio}
      value={signed}
    />
    <LegendItem
      label="Proposed blocks"
      color="recentBlocks.proposed"
      label="Proposed Blocks"
      ratio={proposedRatio}
      value={proposed}
    />
    <LegendItem
      label="Missed blocks"
      color="recentBlocks.missed"
      label="Missed Blocks"
      ratio={missedRatio}
      value={missed}
    />
  </Flex>
);
