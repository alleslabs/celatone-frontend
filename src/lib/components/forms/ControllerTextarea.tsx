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

import { getResponseMsg } from "./FormStatus";
import type { TextAreaProps } from "./TextAreaInput";

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
