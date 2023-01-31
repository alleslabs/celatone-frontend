import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import big from "big.js";
import type { ReactElement } from "react";
import { IoIosWarning } from "react-icons/io";
import { MdCheckCircle, MdDeleteOutline } from "react-icons/md";

import type { SimulateStatus } from "../types";
import { UploadIcon } from "lib/components/icon/UploadIcon";

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
        icon: <Icon as={MdCheckCircle} boxSize="6" color="success.main" />,
        statusText: <span style={{ color: "#66BB6A" }}>Valid Wasm file</span>,
      };
    case "failed":
      return {
        icon: <Icon as={IoIosWarning} boxSize="6" color="error.main" />,
        statusText: <span style={{ color: "#EF5350" }}>Invalid Wasm file</span>,
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
        borderRadius="4px"
        border="1px solid"
        borderColor={isError ? "error.main" : "pebble.900"}
      >
        <UploadIcon />
        <Flex direction="column">
          <Text variant="body1" color="text.main">
            {file.name}
          </Text>
          <Text variant="body2" color="text.dark">
            {big(file.size).div(1000).toFixed(0)} KB • {statusText}
          </Text>
        </Flex>
        <Flex align="center" gap="16px" ml="auto">
          <Icon
            as={MdDeleteOutline}
            color="text.dark"
            boxSize="6"
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
