import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface InfoLabelValueProps {
  label: string;
  value: ReactNode;
}

export const InfoLabelValue = ({ label, value }: InfoLabelValueProps) => (
  <Flex w="full" direction={{ base: "column", md: "row" }} gap={4}>
    <Text
      variant="body2"
      mb={{ base: 1, md: 0 }}
      whiteSpace="nowrap"
      w="full"
      flex={1}
    >
      {label}
    </Text>
    <Flex flex={3}>{value}</Flex>
  </Flex>
);
