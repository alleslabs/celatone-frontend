import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon/CustomIcon";

interface ErrorMessageRenderProps extends FlexProps {
  error: string;
}

export const ErrorMessageRender = ({
  error,
  ...restProps
}: ErrorMessageRenderProps) => {
  return (
    <Flex gap={2} {...restProps}>
      <CustomIcon name="alert-solid" color="error.main" boxSize="3" />
      <Text variant="body3" color="error.main">
        {error}
      </Text>
    </Flex>
  );
};
