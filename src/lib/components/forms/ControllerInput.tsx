import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useWatch, useController } from "react-hook-form";

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
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          className={field.value.length ? "floating" : ""}
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
      <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      {!error && (
        <FormHelperText className="helper-text">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
