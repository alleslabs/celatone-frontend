import { Flex, Text } from "@chakra-ui/react";

import type { ComputedUptime, Ratio } from "lib/types";
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
    <Flex w={3} h={3} borderRadius="2px" backgroundColor={color} mt={1} />
    <Flex
      direction={{ base: "row", md: "column" }}
      alignItems={{ base: "center", md: "start" }}
    >
      <Text
        variant="body2"
        fontWeight={700}
        color="text.dark"
        w={{ base: 40, md: "auto" }}
      >
        {label}
      </Text>
      <Text
        variant={{ base: "body2", md: "body1" }}
        fontWeight={700}
        color="text.main"
        w={{ base: 12, md: "auto" }}
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
  uptime: { signed, proposed, missed, signedRatio, proposedRatio, missedRatio },
}: RecentBlocksLegendsProps) => (
  <Flex direction={{ base: "column", md: "row" }}>
    <LegendItem
      label="Signed Blocks"
      color="primary.main"
      value={signed}
      ratio={signedRatio}
    />
    <LegendItem
      label="Proposed Blocks"
      color="secondary.main"
      value={proposed}
      ratio={proposedRatio}
    />
    <LegendItem
      label="Missed Blocks"
      color="error.dark"
      value={missed}
      ratio={missedRatio}
    />
  </Flex>
);
