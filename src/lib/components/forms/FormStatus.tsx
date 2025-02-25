import { Spinner, Text } from "@chakra-ui/react";

import type { Nullable } from "lib/types";
import { CustomIcon } from "../icon";

export type ResponseState = "init" | "loading" | "success" | "error";

export interface FormStatus {
  state: ResponseState;
  message?: Nullable<string>;
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
          name="alert-triangle-solid"
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
        <Text color={statusInfo.messageColor ?? "success.main"} variant="body3">
          {statusInfo.message}
        </Text>
      );
    case "error":
      return (
        <Text color={statusInfo.messageColor ?? "error.main"} variant="body3">
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
