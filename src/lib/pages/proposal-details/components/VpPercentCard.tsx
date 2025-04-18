import type { FlexProps } from "@chakra-ui/react";
import type Big from "big.js";
import type { Nullable, Ratio } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { d0Formatter, formatPrettyPercent } from "lib/utils";
import { isNull } from "lodash";

interface VpPercentCardProps {
  name: string;
  ratio: Nullable<Ratio<number>>;
  power: Nullable<Big>;
  color: FlexProps["bgColor"];
  isCompact: boolean;
}

export const VpPercentCard = ({
  color,
  isCompact,
  name,
  power,
  ratio,
}: VpPercentCardProps) => (
  <Flex
    direction={isCompact ? "row-reverse" : "column"}
    gap={2}
    justifyContent="flex-end"
    w="full"
  >
    <Flex align="start" direction="column" gap={isCompact ? 1 : 2}>
      <Text color="text.main" variant="body2">
        {name}
      </Text>
      <Flex direction={isCompact ? "row" : "column"} gap={isCompact ? 2 : 0}>
        <Heading
          as="h6"
          color={ratio ? "text.main" : "text.dark"}
          fontWeight={600}
          variant="h6"
        >
          {!isNull(ratio) ? formatPrettyPercent(ratio) : "N/A"}
        </Heading>
        <Text color="text.dark" variant="body2">
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
