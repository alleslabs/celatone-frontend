import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
  Text,
} from "@chakra-ui/react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

import type { TextAreaProps } from "./TextAreaInput";
import type { FormStatus } from "./TextInput";

const getResponseMsg = (statusInfo: FormStatus, helperText = "") => {
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

interface ControllerTextareaProps<T extends FieldValues>
  extends Omit<TextAreaProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
}

export const ControllerTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  status,
  ...componentProps
}: ControllerTextareaProps<T>) => {
  const { field } = useController({ name, control });
  return (
    <FormControl
      className="textarea-form"
      size="md"
      isInvalid={!!error || status?.state === "error"}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          bgColor={labelBgColor}
          className={field.value.length !== 0 ? "floating" : ""}
        >
          {label}
        </FormLabel>
      )}
      <Textarea resize="none" placeholder={placeholder} />
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
