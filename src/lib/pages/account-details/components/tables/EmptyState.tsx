import { Flex } from "@chakra-ui/react";

interface EmptyStateProps {
  text: string;
}

export const EmptyState = ({ text }: EmptyStateProps) => (
  <Flex
    align="center"
    justify="center"
    borderY="1px solid"
    borderColor="pebble.700"
    py={12}
  >
    {text}
  </Flex>
);
