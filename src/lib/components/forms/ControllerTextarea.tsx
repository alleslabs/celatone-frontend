import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useController, useWatch } from "react-hook-form";

import type { TextareaProps } from "./TextareaInput";

interface ControllerTextareaProps<T extends FieldValues>
  extends Omit<TextareaProps, "setInputState" | "value"> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: UseControllerProps["rules"];
}

export const ControllerTextarea = <T extends FieldValues>({
  control,
  error,
  height = "112px",
  helperText,
  label,
  labelBgColor = "background.main",
  name,
  placeholder = " ",
  rules = {},
  ...componentProps
}: ControllerTextareaProps<T>) => {
  const watcher = useWatch({
    control,
    name,
  });
  const { field } = useController<T>({ control, name, rules });
  const isError = Boolean(error);
  const isRequired = "required" in rules;
  return (
    <FormControl
      isInvalid={isError}
      isRequired={isRequired}
      size="md"
      sx={{ "> div": { marginTop: "1 !important" } }}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel className="textarea-label" bgColor={labelBgColor}>
          {label}
        </FormLabel>
      )}
      <Textarea
        height={height}
        resize="none"
        value={watcher}
        onChange={field.onChange}
        placeholder={placeholder}
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
