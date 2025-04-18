import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";

interface EvmInfoLabelValueProps {
  label: string;
  value: ReactNode;
}

export const EvmInfoLabelValue = ({ label, value }: EvmInfoLabelValueProps) => (
  <Flex direction={{ base: "column", md: "row" }} gap={1} w="full">
    <Text
      color="text.dark"
      flex={1}
      fontWeight={500}
      mb={{ base: 1, md: 0 }}
      variant="body2"
      w="full"
      whiteSpace="nowrap"
    >
      {label}
    </Text>
    <Flex flex={3}>{value}</Flex>
  </Flex>
);
