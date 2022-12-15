import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useWatch, useController } from "react-hook-form";

import type { TextInputProps } from "./TextInput";

interface ControllerInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps["rules"];
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
  rules = {},
  ...componentProps
}: ControllerInputProps<T>) => {
  const watcher = useWatch({
    name,
    control,
  });

  const { field } = useController({
    name,
    control,
    rules,
  });

  const isError = !!error;
  return (
    <FormControl
      className={`${size}-form`}
      size={size}
      isInvalid={isError}
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
      {isError ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text">
          <Text color="text.dark">{helperText}</Text>
        </FormHelperText>
      )}
    </FormControl>
  );
};
