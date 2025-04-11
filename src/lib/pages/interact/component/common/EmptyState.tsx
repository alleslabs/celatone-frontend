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
    alignItems="center"
    border={noBorder ? "none" : "1px solid"}
    borderColor="gray.700"
    borderRadius="8px"
    direction="column"
    gap={4}
    h={h}
    justifyContent="center"
    p={p}
    w="full"
  >
    {hasImage && <StateImage imageVariant="empty" imageWidth={imageWidth} />}
    <Text color="text.dark" textAlign="center" variant="body2">
      {description}
    </Text>
  </Flex>
);

export const NoImageEmptyState = ({ desc }: { desc: string }) => (
  <ModuleEmptyState description={desc} h="fit-content" p={4} />
);
