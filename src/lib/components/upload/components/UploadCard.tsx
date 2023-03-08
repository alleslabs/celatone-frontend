import { Flex, Spinner, Text } from "@chakra-ui/react";
import big from "big.js";
import type { ReactElement } from "react";

import type { SimulateStatus } from "../types";
import { CustomIcon, UploadIcon } from "lib/components/icon";

interface UploadCardProps {
  file: File;
  deleteFile: () => void;
  simulateStatus: SimulateStatus;
  simulateError: string;
}

interface StatusDecorator {
  icon: JSX.Element | null;
  statusText: ReactElement | string;
  helperText?: string;
}

const getStatusDecorator = (
  status: SimulateStatus,
  error: string
): StatusDecorator => {
  switch (status) {
    case "completed":
      return {
        icon: <CustomIcon name="check-circle-solid" color="success.main" />,
        statusText: <Text color="success.main">Valid Wasm file</Text>,
      };
    case "failed":
      return {
        icon: <CustomIcon name="alert-circle-solid" color="error.main" />,
        statusText: <Text color="error.main">Invalid Wasm file</Text>,
        helperText: error,
      };
    default:
      return {
        icon: <Spinner color="violet.light" w="40px" h="40px" />,
        statusText: "Loading",
      };
  }
};
export const UploadCard = ({
  file,
  deleteFile,
  simulateStatus,
  simulateError,
}: UploadCardProps) => {
  const isError = simulateStatus === "failed";
  const {
    icon: StatusIcon,
    statusText,
    helperText,
  } = getStatusDecorator(simulateStatus, simulateError);
  return (
    <>
      <Flex
        align="center"
        p="16px"
        gap="16px"
        w="full"
        bgColor="pebble.900"
        borderRadius="8px"
        border="1px solid"
        borderColor={isError ? "error.main" : "pebble.900"}
      >
        <UploadIcon />
        <Flex direction="column">
          <Text variant="body1">{file.name}</Text>
          <Text variant="body2" color="text.dark" display="flex" gap="4px">
            {big(file.size).div(1000).toFixed(0)} KB • {statusText}
          </Text>
        </Flex>
        <Flex align="center" gap="16px" ml="auto">
          <CustomIcon
            name="delete"
            color="text.dark"
            onClick={deleteFile}
            cursor="pointer"
          />
          {StatusIcon}
        </Flex>
      </Flex>
      {isError && (
        <Text variant="body3" color="error.main" mt={1} alignSelf="start">
          {helperText}
        </Text>
      )}
    </>
  );
};
