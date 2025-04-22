import type { Nullable } from "lib/types";

import { Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

export type ResponseState = "error" | "init" | "loading" | "success";

export interface FormStatus {
  message?: Nullable<string>;
  messageColor?: string;
  state: ResponseState;
}

export const getStatusIcon = (state: ResponseState, boxSize = "1em") => {
  switch (state) {
    case "error":
      return (
        <CustomIcon
          boxSize={boxSize}
          color="error.light"
          name="alert-triangle-solid"
        />
      );
    case "loading":
      return <Spinner size="sm" />;
    case "success":
      return (
        <CustomIcon
          boxSize={boxSize}
          color="success.main"
          name="check-circle-solid"
        />
      );
    case "init":
    default:
      return null;
  }
};

export const getResponseMsg = (statusInfo: FormStatus, helperText = "") => {
  switch (statusInfo.state) {
    case "error":
      return (
        <Text color={statusInfo.messageColor ?? "error.main"} variant="body3">
          {statusInfo.message}
        </Text>
      );
    case "success":
      return (
        <Text color={statusInfo.messageColor ?? "success.main"} variant="body3">
          {statusInfo.message}
        </Text>
      );
    case "init":
    case "loading":
    default:
      return (
        <Text color={statusInfo.messageColor ?? "text.dark"} variant="body3">
          {helperText}
        </Text>
      );
  }
};
