import { Flex, Spinner, Text } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <Flex
      borderY="1px solid"
      borderColor="divider.main"
      width="full"
      py={12}
      flexDirection="column"
      alignItems="center"
    >
      <Spinner size="xl" speed="0.65s" />
      <Text mt="20px">Loading ...</Text>
    </Flex>
  );
};
