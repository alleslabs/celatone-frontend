import { Flex, Spinner, Text } from "@chakra-ui/react";

export const Loading = () => (
  <Flex
    borderY="1px solid"
    borderColor="gray.700"
    width="full"
    py={15}
    my={12}
    flexDirection="column"
    alignItems="center"
  >
    <Spinner size="xl" />
    <Text mt={5}>Loading ...</Text>
  </Flex>
);
