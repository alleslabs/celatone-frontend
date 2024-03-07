import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { StateImage } from "lib/components/state";

interface ModuleEmptyStateProps {
  description: string;
  imageWidth?: string;
  hasImage?: boolean;
  noBorder?: boolean;
  h?: FlexProps["h"];
  p?: FlexProps["p"];
}

export const ModuleEmptyState = ({
  description,
  imageWidth = "160px",
  hasImage = false,
  noBorder = false,
  h = "full",
  p,
}: ModuleEmptyStateProps) => (
  <Flex
    h={h}
    p={p}
    w="full"
    justifyContent="center"
    alignItems="center"
    border={noBorder ? "none" : "1px solid"}
    borderRadius="8px"
    borderColor="gray.700"
    direction="column"
    gap={4}
  >
    {hasImage && <StateImage imageVariant="empty" imageWidth={imageWidth} />}
    <Text variant="body2" color="text.dark" textAlign="center">
      {description}
    </Text>
  </Flex>
);

export const NoImageEmptyState = ({ desc }: { desc: string }) => (
  <ModuleEmptyState h="fit-content" p={4} description={desc} />
);
