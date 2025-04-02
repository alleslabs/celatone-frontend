import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";

interface NftInfoItemProps {
  children: ReactNode;
  label: string;
  isCentered?: boolean;
}

export const NftInfoItem = ({
  children,
  label,
  isCentered = true,
}: NftInfoItemProps) => (
  <Flex
    align={{ base: "start", md: isCentered ? "center" : "start" }}
    direction={{ base: "column", md: "row" }}
    gap={{ base: 0, md: 2 }}
    height={{ md: 6 }}
    mb={{ base: 2, md: 0 }}
  >
    <Text
      color="gray.400"
      fontWeight={500}
      minW={24}
      mt={isCentered ? 0 : 0.5}
      variant="body2"
      whiteSpace="nowrap"
    >
      {label}
    </Text>
    {children}
  </Flex>
);
