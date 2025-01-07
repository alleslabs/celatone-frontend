import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface EvmInfoLabelValueProps {
  label: string;
  value: ReactNode;
}

export const EvmInfoLabelValue = ({ label, value }: EvmInfoLabelValueProps) => (
  <Flex gap={1} w="full" direction={{ base: "column", md: "row" }}>
    <Text
      flex={1}
      mb={{ base: 1, md: 0 }}
      variant="body2"
      w="full"
      whiteSpace="nowrap"
      color="text.dark"
      fontWeight={500}
    >
      {label}
    </Text>
    <Flex flex={3}>{value}</Flex>
  </Flex>
);
