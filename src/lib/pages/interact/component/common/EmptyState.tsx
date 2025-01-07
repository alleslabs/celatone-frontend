import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { StateImage } from "lib/components/state";

interface ModuleEmptyStateProps {
  description: string;
  h?: FlexProps["h"];
  hasImage?: boolean;
  imageWidth?: string;
  noBorder?: boolean;
  p?: FlexProps["p"];
}

export const ModuleEmptyState = ({
  description,
  h = "full",
  hasImage = false,
  imageWidth = "160px",
  noBorder = false,
  p,
}: ModuleEmptyStateProps) => (
  <Flex
    alignItems="center"
    gap={4}
    h={h}
    p={p}
    w="full"
    border={noBorder ? "none" : "1px solid"}
    borderColor="gray.700"
    borderRadius="8px"
    direction="column"
    justifyContent="center"
  >
    {hasImage && <StateImage imageWidth={imageWidth} imageVariant="empty" />}
    <Text textAlign="center" variant="body2" color="text.dark">
      {description}
    </Text>
  </Flex>
);

export const NoImageEmptyState = ({ desc }: { desc: string }) => (
  <ModuleEmptyState h="fit-content" p={4} description={desc} />
);
