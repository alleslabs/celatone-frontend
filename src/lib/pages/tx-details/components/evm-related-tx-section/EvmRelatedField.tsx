import { Flex, Text } from "@chakra-ui/react";
import type { FlexProps, TextProps } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

interface EvmRelatedFieldProps {
  label: TextProps["children"];
  children: FlexProps["children"];
}

export const EvmRelatedField = ({ label, children }: EvmRelatedFieldProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      direction={{ base: "row", xl: "column" }}
      align={{ base: "center", xl: "start" }}
      maxW={{ base: "full", xl: "240px" }}
      flex={1}
      height="full"
    >
      <Text
        variant="body2"
        color="text.dark"
        fontWeight={500}
        width={isMobile ? 20 : 36}
      >
        {label}
      </Text>
      <Flex height="full" align="center">
        {children}
      </Flex>
    </Flex>
  );
};
