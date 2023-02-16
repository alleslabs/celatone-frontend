import { Icon, Spinner, Text } from "@chakra-ui/react";
import { MdCheckCircle, MdOutlineWarning } from "react-icons/md";

export type ResponseState = "init" | "loading" | "success" | "error";

export interface FormStatus {
  state: ResponseState;
  message?: string;
}

export const getStatusIcon = (state: ResponseState, boxSize = "1em") => {
  switch (state) {
    case "loading":
      return <Spinner size="sm" />;
    case "success":
      return <Icon color="success.main" as={MdCheckCircle} boxSize={boxSize} />;
    case "error":
      return (
        <Icon color="error.light" as={MdOutlineWarning} boxSize={boxSize} />
      );
    case "init":
    default:
      return null;
  }
};

export const getResponseMsg = (statusInfo: FormStatus, helperText = "") => {
  switch (statusInfo.state) {
    case "success":
      return <Text color="success.main">{statusInfo.message}</Text>;
    case "error":
      return <Text color="error.main">{statusInfo.message}</Text>;
    case "init":
    case "loading":
    default:
      return <Text color="text.dark">{helperText}</Text>;
  }
};
