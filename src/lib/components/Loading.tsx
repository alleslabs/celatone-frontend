import { Flex, Spinner, Text } from "@chakra-ui/react";

interface LoadingProps {
  withBorder?: boolean;
}

export const Loading = ({ withBorder = true }: LoadingProps) => (
  <Flex
    borderY={withBorder ? "1px solid" : undefined}
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
