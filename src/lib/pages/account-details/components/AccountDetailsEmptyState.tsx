import type { FlexProps, StyleProps, TextProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";

export interface AccountDetailsEmptyStateProps {
  message: string;
  textVariant?: TextProps["variant"];
  pt?: FlexProps["pt"];
  borderBottomWidth?: StyleProps["borderBottomWidth"];
  borderColor?: StyleProps["borderColor"];
}

export const AccountDetailsEmptyState = ({
  message,
  textVariant = "body1",
  pt = 2,
  borderBottomWidth = "1px",
  borderColor = "gray.700",
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
