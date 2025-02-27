import type { FlexProps } from "@chakra-ui/react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";
import { CustomIcon } from "../icon";

interface SimulateMessageRenderProps extends FlexProps {
  value: Option<string>;
  isLoading: boolean;
  isSuccess: boolean;
}

const item = {
  success: {
    color: "success.main",
    icon: (
      <CustomIcon name="check-circle-solid" color="success.main" boxSize="3" />
    ),
  },
  fail: {
    color: "error.main",
    icon: (
      <CustomIcon name="alert-triangle-solid" color="error.main" boxSize="3" />
    ),
  },
  loading: {
    color: "gray.500",
    icon: <Spinner color="gray.600" size="sm" mx={1} />,
  },
};

const getStatus = (isLoading: boolean, isSuccess: boolean) => {
  if (isLoading) return "loading";
  if (isSuccess) return "success";
  return "fail";
};

export const SimulateMessageRender = ({
  value,
  isLoading,
  isSuccess,
  ...restProps
}: SimulateMessageRenderProps) => {
  const status = getStatus(isLoading, isSuccess);
  return (
    <Flex gap={2} align="center" {...restProps}>
      {item[status].icon}
      <Text variant="body3" color={item[status].color}>
        {value}
      </Text>
    </Flex>
  );
};
