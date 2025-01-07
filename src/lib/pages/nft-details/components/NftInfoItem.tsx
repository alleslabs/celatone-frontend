import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
    gap={{ base: 0, md: 2 }}
    height={{ md: 6 }}
    mb={{ base: 2, md: 0 }}
    direction={{ base: "column", md: "row" }}
  >
    <Text
      minW={24}
      mt={isCentered ? 0 : 0.5}
      variant="body2"
      whiteSpace="nowrap"
      color="gray.400"
      fontWeight={500}
    >
      {label}
    </Text>
    {children}
  </Flex>
);
