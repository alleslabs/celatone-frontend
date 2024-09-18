import type { FlexProps, StyleProps, TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

export interface AccountDetailsEmptyStateProps {
  message: string;
  textVariant?: TextProps["variant"];
  pt?: FlexProps["pt"];
  borderBottom?: StyleProps["borderBottom"];
  borderColor?: StyleProps["borderColor"];
}

export const AccountDetailsEmptyState = ({
  message,
  textVariant = "body1",
  pt = 2,
  borderBottom = "1px solid",
  borderColor = "gray.700",
}: AccountDetailsEmptyStateProps) => (
  <Flex
    alignItems="flex-start"
    flexDir="column"
    gap={4}
    width="full"
    pt={pt}
    pb={8}
    direction="column"
    borderBottom={borderBottom}
    borderColor={borderColor}
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
