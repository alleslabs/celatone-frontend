import type { TextProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";

interface LegendTextProps extends TextProps {
  label?: string;
  legendColor: string;
}

export const LegendText = ({
  label,
  legendColor,
  ...TextProps
}: LegendTextProps) => (
  <Flex alignItems="center" gap={3} px={1}>
    <Flex
      backgroundColor={legendColor}
      borderRadius="100%"
      h="14px"
      minH="14px"
      minW="14px"
      w="14px"
    />
    {label && <Text {...TextProps}>{label}</Text>}
  </Flex>
);
