import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useWatch, useController } from "react-hook-form";

import { getResponseMsg } from "./FormStatus";
import type { TextInputProps } from "./TextInput";

interface ControllerInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
}

export const ControllerInput = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  error,
  placeholder = " ",
  size = "lg",
  type = "text",
  status,
  ...componentProps
}: ControllerInputProps<T>) => {
  const { field } = useController({ name, control });
  const watcher = useWatch({
    name,
    control,
  });

  return (
    <FormControl
      className={`${size}-form`}
      size={size}
      isInvalid={!!error || status?.state === "error"}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          className={field.value.length !== 0 ? "floating" : ""}
          bgColor={labelBgColor}
        >
          {label}
        </FormLabel>
      )}
      <Input
        size={size}
        placeholder={placeholder}
        type={type}
        value={watcher}
        onChange={field.onChange}
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
