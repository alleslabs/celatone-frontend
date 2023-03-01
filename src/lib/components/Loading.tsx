import { Flex, Spinner, Text } from "@chakra-ui/react";

export const Loading = () => (
  <Flex
    borderY="1px solid"
    borderColor="pebble.700"
    width="full"
    py={12}
    my={12}
    flexDirection="column"
    alignItems="center"
  >
    <Spinner size="xl" speed="0.65s" />
    <Text mt="20px">Loading ...</Text>
  </Flex>
);
