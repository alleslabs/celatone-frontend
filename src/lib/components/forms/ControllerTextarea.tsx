import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useController, useWatch } from "react-hook-form";

import type { TextareaProps } from "./TextareaInput";

interface ControllerTextareaProps<T extends FieldValues>
  extends Omit<TextareaProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
}

export const ControllerTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  height = "112px",
  rules = {},
  ...componentProps
}: ControllerTextareaProps<T>) => {
  const watcher = useWatch({
    name,
    control,
  });
  const {
    field,
    fieldState: { isDirty, isTouched },
  } = useController<T>({ name, control, rules });
  const isError = Boolean(error);
  const isRequired = "required" in rules;
  return (
    <FormControl
      isInvalid={isError && (isDirty || isTouched)}
      isRequired={isRequired}
      size="md"
      sx={{ "> div": { marginTop: "1 !important" } }}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          className="textarea-label"
          bgColor={labelBgColor}
          requiredIndicator={
            <Text as="span" color="error.main" pl={1}>
              * (Required)
            </Text>
          }
        >
          {label}
        </FormLabel>
      )}
      <Textarea
        height={height}
        placeholder={placeholder}
        resize="none"
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
