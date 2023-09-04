import { Text, Flex } from "@chakra-ui/react";

import { StateImage } from "lib/components/state";

interface ModuleEmptyStateProps {
  description?: string;
  imageWidth?: string;
}
export const ModuleEmptyState = ({
  description = "Available functions for selected modules will display here",
  imageWidth = "160px",
}: ModuleEmptyStateProps) => {
  return (
    <Flex
      h="full"
      w="full"
      justifyContent="center"
      alignItems="center"
      border="1px solid"
      borderRadius={4}
      borderColor="gray.700"
    >
      <Flex flexDirection="column" gap={4} alignItems="center">
        <StateImage imageVariant="empty" imageWidth={imageWidth} />
        <Text variant="body2" color="text.dark">
          {description}
        </Text>
      </Flex>
    </Flex>
  );
};
