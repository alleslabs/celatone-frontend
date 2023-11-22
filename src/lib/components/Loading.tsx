import type { FlexProps } from "@chakra-ui/react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

interface LoadingProps extends FlexProps {
  withBorder?: boolean;
}

export const Loading = ({ withBorder = false, ...flexProps }: LoadingProps) => (
  <Flex
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="gray.700"
    width="full"
    py={15}
    my={12}
    flexDirection="column"
    alignItems="center"
    {...flexProps}
  >
    <Spinner size="xl" />
    <Text mt={5}>Loading ...</Text>
  </Flex>
);
