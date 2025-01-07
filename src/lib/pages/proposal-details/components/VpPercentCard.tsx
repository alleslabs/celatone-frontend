import { Flex, Heading, Text } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";
import type Big from "big.js";
import { isNull } from "lodash";

import type { Nullable, Ratio } from "lib/types";
import { d0Formatter, formatPrettyPercent } from "lib/utils";

interface VpPercentCardProps {
  color: FlexProps["bgColor"];
  isCompact: boolean;
  name: string;
  power: Nullable<Big>;
  ratio: Nullable<Ratio<number>>;
}

export const VpPercentCard = ({
  color,
  isCompact,
  name,
  power,
  ratio,
}: VpPercentCardProps) => (
  <Flex
    gap={2}
    w="full"
    direction={isCompact ? "row-reverse" : "column"}
    justifyContent="flex-end"
  >
    <Flex align="start" gap={isCompact ? 1 : 2} direction="column">
      <Text variant="body2" color="text.main">
        {name}
      </Text>
      <Flex gap={isCompact ? 2 : 0} direction={isCompact ? "row" : "column"}>
        <Heading
          as="h6"
          variant="h6"
          color={ratio ? "text.main" : "text.dark"}
          fontWeight={600}
        >
          {!isNull(ratio) ? formatPrettyPercent(ratio) : "N/A"}
        </Heading>
        <Text variant="body2" color="text.dark">
          ({!isNull(power) ? d0Formatter(power, "0") : "-"})
        </Text>
      </Flex>
    </Flex>
    <Flex
      bgColor={color}
      borderRadius={10}
      {...(isCompact ? { h: "full", w: 1 } : { h: 1, w: "full" })}
    />
  </Flex>
);
