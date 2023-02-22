import { Flex, Text, Image } from "@chakra-ui/react";

interface EmptyStateProps {
  image?: string;
  message: string;
}

export const EmptyState = ({ message, image }: EmptyStateProps) => {
  return (
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {image && (
        <Image
          src="https://assets.alleslabs.dev/illustration/search-not-found.svg"
          alt="result not found"
          width="200px"
        />
      )}
      <Text color="text.dark" w="540px" textAlign="center">
        {message}
      </Text>
    </Flex>
  );
};
