import type { FlexProps } from "@chakra-ui/react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

interface LoadingProps extends FlexProps {
  withBorder?: boolean;
}

export const Loading = ({ withBorder = false, ...flexProps }: LoadingProps) => (
  <Flex
    width="full"
    alignItems="center"
    my={12}
    py={15}
    borderColor="gray.700"
    borderY={withBorder ? "1px solid" : undefined}
    flexDirection="column"
    {...flexProps}
  >
    <Spinner size="xl" />
    <Text mt={5}>Loading ...</Text>
  </Flex>
);
