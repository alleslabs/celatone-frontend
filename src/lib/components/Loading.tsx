import { Flex, Spinner, Text } from "@chakra-ui/react";

interface LoadingProps {
  withBorder?: boolean;
}

export const Loading = ({ withBorder = true }: LoadingProps) => (
  <Flex
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="pebble.700"
    width="full"
    py="60px"
    my={12}
    flexDirection="column"
    alignItems="center"
  >
    <Spinner size="xl" speed="0.65s" />
    <Text mt="20px">Loading ...</Text>
  </Flex>
);
