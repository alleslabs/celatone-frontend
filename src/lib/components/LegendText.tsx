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
  <Flex gap={3} px={1} alignItems="center">
    <Flex
      w="14px"
      h="14px"
      minW="14px"
      minH="14px"
      backgroundColor={legendColor}
      borderRadius="100%"
    />
    {label && <Text {...TextProps}>{label}</Text>}
  </Flex>
);
