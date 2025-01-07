import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface ErrorMessageRenderProps extends FlexProps {
  error: string;
}

export const ErrorMessageRender = ({
  error,
  ...restProps
}: ErrorMessageRenderProps) => (
  <Flex gap={2} {...restProps}>
    <CustomIcon name="alert-triangle-solid" boxSize={3} color="error.main" />
    <Text variant="body3" color="error.main">
      {error}
    </Text>
  </Flex>
);
