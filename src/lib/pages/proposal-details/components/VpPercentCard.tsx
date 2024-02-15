import { Flex, Text, type FlexProps, Heading } from "@chakra-ui/react";

import { d0Formatter, formatPrettyPercent } from "lib/utils";

interface VpPercentCardProps {
  name: string;
  ratio: Big;
  power: Big;
  color: FlexProps["bgColor"];
  isCompact: boolean;
}

export const VpPercentCard = ({
  name,
  ratio,
  power,
  color,
  isCompact,
}: VpPercentCardProps) => (
  <Flex
    direction={isCompact ? "row-reverse" : "column"}
    justifyContent="flex-end"
    gap={2}
    w="full"
  >
    <Flex direction="column" gap={isCompact ? 1 : 2} align="start">
      <Text variant="body2" color="text.main">
        {name}
      </Text>
      <Flex direction={isCompact ? "row" : "column"} gap={isCompact ? 2 : 0}>
        <Heading as="h6" variant="h6" fontWeight={600}>
          {formatPrettyPercent(ratio.toNumber())}
        </Heading>
        <Text variant="body2" color="text.dark">
          ({d0Formatter(power, "0")})
        </Text>
      </Flex>
    </Flex>
    <Flex
      bgColor={color}
      borderRadius={10}
      {...(isCompact ? { w: 1, h: "full" } : { w: "full", h: 1 })}
    />
  </Flex>
);
