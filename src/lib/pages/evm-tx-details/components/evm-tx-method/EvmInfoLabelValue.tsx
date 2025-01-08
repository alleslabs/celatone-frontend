import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface EvmInfoLabelValueProps {
  label: string;
  value: ReactNode;
}

export const EvmInfoLabelValue = ({ label, value }: EvmInfoLabelValueProps) => (
  <Flex w="full" direction={{ base: "column", md: "row" }} gap={1}>
    <Text
      variant="body2"
      mb={{ base: 1, md: 0 }}
      whiteSpace="nowrap"
      w="full"
      fontWeight={500}
      flex={1}
      color="text.dark"
    >
      {label}
    </Text>
    <Flex flex={3}>{value}</Flex>
  </Flex>
);
