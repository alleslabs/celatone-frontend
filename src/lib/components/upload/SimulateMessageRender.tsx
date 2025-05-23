import type { FlexProps } from "@chakra-ui/react";
import type { Option } from "lib/types";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface SimulateMessageRenderProps extends FlexProps {
  isLoading: boolean;
  isSuccess: boolean;
  value: Option<string>;
}

const item = {
  fail: {
    color: "error.main",
    icon: (
      <CustomIcon boxSize="3" color="error.main" name="alert-triangle-solid" />
    ),
  },
  loading: {
    color: "gray.500",
    icon: <Spinner color="gray.600" mx={1} size="sm" />,
  },
  success: {
    color: "success.main",
    icon: (
      <CustomIcon boxSize="3" color="success.main" name="check-circle-solid" />
    ),
  },
};

const getStatus = (isLoading: boolean, isSuccess: boolean) => {
  if (isLoading) return "loading";
  if (isSuccess) return "success";
  return "fail";
};

export const SimulateMessageRender = ({
  isLoading,
  isSuccess,
  value,
  ...restProps
}: SimulateMessageRenderProps) => {
  const status = getStatus(isLoading, isSuccess);
  return (
    <Flex align="center" gap={2} {...restProps}>
      {item[status].icon}
      <Text color={item[status].color} variant="body3">
        {value}
      </Text>
    </Flex>
  );
};
