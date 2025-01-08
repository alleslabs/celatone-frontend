import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
    gap={{ base: 0, md: 2 }}
    mb={{ base: 2, md: 0 }}
    direction={{ base: "column", md: "row" }}
    align={{ base: "start", md: isCentered ? "center" : "start" }}
    height={{ md: 6 }}
  >
    <Text
      variant="body2"
      color="gray.400"
      fontWeight={500}
      mt={isCentered ? 0 : 0.5}
      whiteSpace="nowrap"
      minW={24}
    >
      {label}
    </Text>
    {children}
  </Flex>
);
