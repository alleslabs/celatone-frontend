import { Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import type { Nullable } from "lib/types";

export interface FormStatus {
  message?: Nullable<string>;
  messageColor?: string;
  state: ResponseState;
}

export type ResponseState = "error" | "init" | "loading" | "success";

export const getStatusIcon = (state: ResponseState, boxSize = "1em") => {
  switch (state) {
    case "error":
      return (
        <CustomIcon
          name="alert-triangle-solid"
          boxSize={boxSize}
          color="error.light"
        />
      );
    case "loading":
      return <Spinner size="sm" />;
    case "success":
      return (
        <CustomIcon
          name="check-circle-solid"
          boxSize={boxSize}
          color="success.main"
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
        <Text variant="body3" color={statusInfo.messageColor ?? "error.main"}>
          {statusInfo.message}
        </Text>
      );
    case "success":
      return (
        <Text variant="body3" color={statusInfo.messageColor ?? "success.main"}>
          {statusInfo.message}
        </Text>
      );
    case "init":
    case "loading":
    default:
      return (
        <Text variant="body3" color={statusInfo.messageColor ?? "text.dark"}>
          {helperText}
        </Text>
      );
  }
};
