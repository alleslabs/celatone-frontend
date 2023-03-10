import { Flex, Text, Image } from "@chakra-ui/react";

interface EmptyStateProps {
  image?: string;
  message: string;
  withBorder?: boolean;
}

export const EmptyState = ({
  message,
  image,
  withBorder = false,
}: EmptyStateProps) => (
  <Flex
    py="64px"
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="pebble.700"
  >
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {image && (
        <Image
          src="https://assets.alleslabs.dev/illustration/search-not-found.svg"
          alt="result not found"
          width="200px"
        />
      )}
      <Text color="text.dark" textAlign="center">
        {message}
      </Text>
    </Flex>
  </Flex>
);
