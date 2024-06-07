import type { FlexProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

export interface AccountDetailEmptyStateProps {
  message: string;
  textVariant?: TextProps["variant"];
  pt?: FlexProps["pt"];
}

export const AccountDetailEmptyState = ({
  message,
  textVariant = "body1",
  pt = 2,
}: AccountDetailEmptyStateProps) => (
  <Flex
    alignItems="flex-start"
    flexDir="column"
    gap={4}
    width="full"
    pt={pt}
    pb={8}
    direction="column"
    borderBottom="1px solid"
    borderColor="gray.700"
  >
    <Text
      color="text.dark"
      textAlign="center"
      whiteSpace="pre-wrap"
      variant={textVariant}
    >
      {message}
    </Text>
  </Flex>
);
