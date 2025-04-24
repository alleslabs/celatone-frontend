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
    <CustomIcon boxSize={3} color="error.main" name="alert-triangle-solid" />
    <Text color="error.main" variant="body3">
      {error}
    </Text>
  </Flex>
);
