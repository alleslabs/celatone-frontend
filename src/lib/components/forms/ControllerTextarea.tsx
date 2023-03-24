import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
  Text,
} from "@chakra-ui/react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useWatch, useController } from "react-hook-form";

import type { TextAreaProps } from "./TextAreaInput";

interface ControllerTextareaProps<T extends FieldValues>
  extends Omit<TextAreaProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps["rules"];
}

export const ControllerTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  height,
  rules = {},
  ...componentProps
}: ControllerTextareaProps<T>) => {
  const watcher = useWatch({
    name,
    control,
  });

  const { field } = useController({ name, control, rules });

  const isError = !!error;

  return (
    <FormControl size="md" isInvalid={isError} {...componentProps} {...field}>
      {label && (
        <FormLabel className="textarea-label" bgColor={labelBgColor}>
          {label}
        </FormLabel>
      )}
      <Textarea
        resize="none"
        height={height}
        placeholder={placeholder}
        value={watcher}
        onChange={field.onChange}
      />
      {isError ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text">
          <Text>{helperText}</Text>
        </FormHelperText>
      )}
    </FormControl>
  );
};
