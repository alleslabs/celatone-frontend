import type { FlexProps } from "@chakra-ui/react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import type { Option } from "lib/types";

interface SimulateMessageRenderProps extends FlexProps {
  isLoading: boolean;
  isSuccess: boolean;
  value: Option<string>;
}

const item = {
  fail: {
    color: "error.main",
    icon: (
      <CustomIcon name="alert-triangle-solid" boxSize="3" color="error.main" />
    ),
  },
  loading: {
    color: "gray.500",
    icon: <Spinner mx={1} size="sm" color="gray.600" />,
  },
  success: {
    color: "success.main",
    icon: (
      <CustomIcon name="check-circle-solid" boxSize="3" color="success.main" />
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
      <Text variant="body3" color={item[status].color}>
        {value}
      </Text>
    </Flex>
  );
};
