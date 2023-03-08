import { Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

export type ResponseState = "init" | "loading" | "success" | "error";

export interface FormStatus {
  state: ResponseState;
  message?: string;
  messageColor?: string;
}

export const getStatusIcon = (state: ResponseState, boxSize = "1em") => {
  switch (state) {
    case "loading":
      return <Spinner size="sm" />;
    case "success":
      return (
        <CustomIcon
          name="check-circle-solid"
          color="success.main"
          boxSize={boxSize}
        />
      );
    case "error":
      return (
        <CustomIcon
          name="alert-circle-solid"
          color="error.light"
          boxSize={boxSize}
        />
      );
    case "init":
    default:
      return null;
  }
};

export const getResponseMsg = (statusInfo: FormStatus, helperText = "") => {
  switch (statusInfo.state) {
    case "success":
      return (
        <Text color={statusInfo.messageColor ?? "success.main"}>
          {statusInfo.message}
        </Text>
      );
    case "error":
      return (
        <Text color={statusInfo.messageColor ?? "error.main"}>
          {statusInfo.message}
        </Text>
      );
    case "init":
    case "loading":
    default:
      return (
        <Text color={statusInfo.messageColor ?? "text.dark"}>{helperText}</Text>
      );
  }
};
