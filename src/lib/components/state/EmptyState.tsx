import { Flex, Text, Image, Heading } from "@chakra-ui/react";

type ImageVariant = "empty" | "not-found";

interface EmptyStateProps {
  imageVariant?: ImageVariant;
  message: string;
  heading?: string;
  withBorder?: boolean;
}

const imageSourceMap: Record<ImageVariant, string> = {
  empty: "https://assets.alleslabs.dev/illustration/search-empty.svg",
  "not-found": "https://assets.alleslabs.dev/illustration/search-not-found.svg",
};

export const EmptyState = ({
  message,
  imageVariant,
  heading,
  withBorder = false,
}: EmptyStateProps) => (
  <Flex
    py="64px"
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="pebble.700"
  >
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {imageVariant && (
        <Image
          src={imageSourceMap[imageVariant]}
          alt="result not found"
          width="200px"
        />
      )}
      {heading && (
        <Heading as="h5" variant="h5">
          {heading}
        </Heading>
      )}
      <Text color="text.dark" w="540px" textAlign="center">
        {message}
      </Text>
    </Flex>
  </Flex>
);
