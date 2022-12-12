import type { FormControlProps } from "@chakra-ui/react";
import {
  FormErrorMessage,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
  Text,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { FormStatus } from "./TextInput";

const getResponseMsg = (statusInfo: FormStatus, helperText = "") => {
  switch (statusInfo.state) {
    case "success":
      return <Text color="success.main">{statusInfo.message}</Text>;
    case "error":
      return <Text color="error.light">{statusInfo.message}</Text>;
    case "init":
    case "loading":
    default:
      return <Text color="text.dark">{helperText}</Text>;
  }
};

export interface TextAreaProps extends FormControlProps {
  value: string;
  setInputState: Dispatch<SetStateAction<string>> | ((newVal: string) => void);
  label?: string;
  labelBgColor?: string;
  helperText?: string;
  error?: string;
  status?: FormStatus;
}

export const TextAreaInput = ({
  value,
  setInputState,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  status,
  ...componentProps
}: TextAreaProps) => {
  return (
    <FormControl
      className="textarea-form"
      isInvalid={!!error}
      size="md"
      {...componentProps}
    >
      {label && (
        <FormLabel
          bgColor={labelBgColor}
          className={value.length !== 0 ? "floating" : ""}
        >
          {label}
        </FormLabel>
      )}
      <Textarea
        resize="none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setInputState(e.target.value)}
      />
      {error ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text">
          {status?.message ? (
            getResponseMsg(status, helperText)
          ) : (
            <Text color="text.dark">{helperText}</Text>
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
};
