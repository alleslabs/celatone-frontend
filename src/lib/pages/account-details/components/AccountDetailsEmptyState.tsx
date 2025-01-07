import type { FlexProps, StyleProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

export interface AccountDetailsEmptyStateProps {
  borderBottom?: StyleProps["borderBottom"];
  borderColor?: StyleProps["borderColor"];
  message: string;
  pt?: FlexProps["pt"];
  textVariant?: TextProps["variant"];
}

export const AccountDetailsEmptyState = ({
  borderBottom = "1px solid",
  borderColor = "gray.700",
  message,
  pt = 2,
  textVariant = "body1",
}: AccountDetailsEmptyStateProps) => (
  <Flex
    width="full"
    alignItems="flex-start"
    flexDir="column"
    gap={4}
    pb={8}
    pt={pt}
    borderBottom={borderBottom}
    borderColor={borderColor}
    direction="column"
  >
    <Text
      textAlign="center"
      variant={textVariant}
      whiteSpace="pre-wrap"
      color="text.dark"
    >
      {message}
    </Text>
  </Flex>
);
