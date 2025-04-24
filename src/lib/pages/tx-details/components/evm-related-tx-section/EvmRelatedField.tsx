import type { FlexProps, TextProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";

interface EvmRelatedFieldProps {
  children: FlexProps["children"];
  label: TextProps["children"];
}

export const EvmRelatedField = ({ children, label }: EvmRelatedFieldProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      direction={{ base: "row", xl: "column" }}
      flex={1}
      maxW={{ base: "full", xl: "240px" }}
    >
      <Text
        color="text.dark"
        fontWeight={500}
        variant="body2"
        width={isMobile ? 20 : 36}
      >
        {label}
      </Text>
      <Flex align="center" mt={{ base: 0, xl: 1 }}>
        {children}
      </Flex>
    </Flex>
  );
};
