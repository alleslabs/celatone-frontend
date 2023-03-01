import { Flex, Icon, Text, Image, Heading } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";

type ImageVariant = "empty" | "not-found";

interface EmptyStateProps {
  icon?: IconType;
  imageVariant?: ImageVariant;
  message: string;
  heading?: string;
}

const imageSourceMap: Record<ImageVariant, string> = {
  empty: "https://assets.alleslabs.dev/illustration/search-empty.svg",
  "not-found": "https://assets.alleslabs.dev/illustration/search-not-found.svg",
};

export const EmptyState = ({
  icon,
  message,
  heading,
  imageVariant,
}: EmptyStateProps) => {
  return (
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {icon && <Icon as={icon} color="pebble.600" boxSize="16" />}
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
  );
};
