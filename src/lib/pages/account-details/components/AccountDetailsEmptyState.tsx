import type { FlexProps, StyleProps, TextProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";

export interface AccountDetailsEmptyStateProps {
  borderBottomWidth?: StyleProps["borderBottomWidth"];
  borderColor?: StyleProps["borderColor"];
  message: string;
  pt?: FlexProps["pt"];
  textVariant?: TextProps["variant"];
}

export const AccountDetailsEmptyState = ({
  borderBottomWidth = "1px",
  borderColor = "gray.700",
  message,
  pt = 2,
  textVariant = "body1",
}: AccountDetailsEmptyStateProps) => (
  <Flex
    alignItems="flex-start"
    borderBottomWidth={borderBottomWidth}
    borderColor={borderColor}
    direction="column"
    flexDir="column"
    gap={4}
    pb={8}
    pt={pt}
    width="full"
  >
    <Text
      color="text.dark"
      textAlign="center"
      variant={textVariant}
      whiteSpace="pre-wrap"
    >
      {message}
    </Text>
  </Flex>
);
