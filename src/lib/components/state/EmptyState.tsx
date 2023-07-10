import { Flex, Heading, Text } from "@chakra-ui/react";
import type { ReactElement } from "react";

import type { ImageVariant } from "./StateImage";
import { StateImage } from "./StateImage";

export interface EmptyStateProps {
  imageVariant?: ImageVariant;
  message: string | ReactElement;
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
    py={12}
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="gray.700"
  >
    <Flex alignItems="center" flexDir="column" gap={4} width="full">
      {imageVariant && <StateImage imageVariant={imageVariant} />}
      {heading && (
        <Heading as="h5" variant="h5">
          {heading}
        </Heading>
      )}
      <Text color="text.dark" textAlign="center" whiteSpace="pre-wrap">
        {message}
      </Text>
    </Flex>
  </Flex>
);
