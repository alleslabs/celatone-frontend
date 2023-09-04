import type { FlexProps } from "@chakra-ui/react";
import { Text, Flex } from "@chakra-ui/react";

import { StateImage } from "lib/components/state";

interface ModuleEmptyStateProps {
  description?: string;
  imageWidth?: string;
  hasImage?: boolean;
  noBorder?: boolean;
  h?: FlexProps["h"];
  p?: FlexProps["p"];
}
export const ModuleEmptyState = ({
  description = "Available functions for selected modules will display here",
  imageWidth = "160px",
  hasImage = true,
  noBorder = false,
  h = "full",
  p,
}: ModuleEmptyStateProps) => {
  return (
    <Flex
      h={h}
      p={p}
      w="full"
      justifyContent="center"
      alignItems="center"
      border={noBorder ? "none" : "1px solid"}
      borderRadius="8px"
      borderColor="gray.700"
    >
      <Flex flexDirection="column" gap={4} alignItems="center">
        {hasImage && (
          <StateImage imageVariant="empty" imageWidth={imageWidth} />
        )}
        <Text variant="body2" color="text.dark" textAlign="center">
          {description}
        </Text>
      </Flex>
    </Flex>
  );
};
