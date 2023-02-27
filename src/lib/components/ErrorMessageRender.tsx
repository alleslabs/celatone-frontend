import type { FlexProps } from "@chakra-ui/react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { IoIosWarning } from "react-icons/io";

interface ErrorMessageRenderProps extends FlexProps {
  error: string;
}

export const ErrorMessageRender = ({
  error,
  ...restProps
}: ErrorMessageRenderProps) => (
  <Flex gap={2} {...restProps}>
    <Icon as={IoIosWarning} boxSize={4} color="error.main" />
    <Text variant="body3" color="error.main">
      {error}
    </Text>
  </Flex>
);
