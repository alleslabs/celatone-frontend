import type { FlexProps } from "@chakra-ui/react";

import { Flex, Spinner, Text } from "@chakra-ui/react";

interface LoadingProps extends FlexProps {
  withBorder?: boolean;
}

export const Loading = ({ withBorder = false, ...flexProps }: LoadingProps) => (
  <Flex
    alignItems="center"
    borderBottomWidth={withBorder ? "1px" : undefined}
    borderColor="gray.700"
    borderTopWidth={withBorder ? "1px" : undefined}
    flexDirection="column"
    my={12}
    py={15}
    width="full"
    {...flexProps}
  >
    <Spinner size="xl" />
    <Text mt={5}>Loading ...</Text>
  </Flex>
);
