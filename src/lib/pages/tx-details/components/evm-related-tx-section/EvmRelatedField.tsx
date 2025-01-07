import { Flex, Text } from "@chakra-ui/react";
import type { FlexProps, TextProps } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

interface EvmRelatedFieldProps {
  children: FlexProps["children"];
  label: TextProps["children"];
}

export const EvmRelatedField = ({ children, label }: EvmRelatedFieldProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      align={{ base: "center", xl: "start" }}
      flex={1}
      height="full"
      maxW={{ base: "full", xl: "240px" }}
      direction={{ base: "row", xl: "column" }}
    >
      <Text
        width={isMobile ? 20 : 36}
        variant="body2"
        color="text.dark"
        fontWeight={500}
      >
        {label}
      </Text>
      <Flex align="center" height="full">
        {children}
      </Flex>
    </Flex>
  );
};
