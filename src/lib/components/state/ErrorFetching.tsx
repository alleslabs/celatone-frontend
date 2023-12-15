import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface ErrorFetchingProps {
  message: string;
}

// TODO: combine with EmptyState after having its image variant
export const ErrorFetching = ({ message }: ErrorFetchingProps) => (
  <Flex
    alignItems="center"
    flexDir="column"
    gap={4}
    width="full"
    borderY="1px solid"
    py={8}
    my={12}
    borderColor="gray.700"
  >
    <CustomIcon
      name="alert-circle-solid"
      color="gray.600"
      boxSize={20}
      mr={3}
    />
    <Text
      color="text.dark"
      textAlign="center"
      whiteSpace="pre-wrap"
      variant="body1"
    >
      {message} Please try again later.
    </Text>
  </Flex>
);
