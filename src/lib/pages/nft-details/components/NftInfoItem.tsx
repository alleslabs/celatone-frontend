import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";

interface NftInfoItemProps {
  children: ReactNode;
  isCentered?: boolean;
  label: string;
}

export const NftInfoItem = ({
  children,
  isCentered = true,
  label,
}: NftInfoItemProps) => (
  <Flex
    align={{ base: "start", md: isCentered ? "center" : "start" }}
    direction={{ base: "column", md: "row" }}
    gap={{ base: 0, md: 2 }}
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
