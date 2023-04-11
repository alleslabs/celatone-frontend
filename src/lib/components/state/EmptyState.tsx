import { Flex, Text, Heading } from "@chakra-ui/react";

import type { ImageVariant } from "./StateImage";
import { StateImage } from "./StateImage";

interface EmptyStateProps {
  imageVariant?: ImageVariant;
  message: string;
  heading?: string;
  withBorder?: boolean;
}

export const EmptyState = ({
  message,
  imageVariant,
  heading,
  withBorder = false,
}: EmptyStateProps) => (
  <Flex
    py={8}
    my={12}
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="pebble.700"
  >
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {imageVariant && <StateImage imageVariant={imageVariant} />}
      {heading && (
        <Heading as="h5" variant="h5">
          {heading}
        </Heading>
      )}
      <Text color="text.dark" textAlign="center">
        {message}
      </Text>
    </Flex>
  </Flex>
);
