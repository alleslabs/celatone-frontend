import type { FieldValues } from "react-hook-form";

import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useController } from "react-hook-form";

import type { FieldProps } from "./types";

import { getRules } from "./utils";

interface BaseFieldProps<T extends FieldValues> extends FieldProps<T> {
  isRequired?: boolean;
}

export const BaseField = <T extends FieldValues>({
  control,
  isDisabled,
  isRequired = false,
  name,
  type,
}: BaseFieldProps<T>) => {
  const {
    field: { onBlur, onChange, value, ...fieldProps },
    fieldState: { error, isDirty, isTouched },
  } = useController({
    control,
    name,
    rules: getRules<T>(type, isRequired),
  });
  const isError = (isTouched || isDirty) && !!error;

  return (
    <FormControl isDisabled={isDisabled} isInvalid={isError} {...fieldProps}>
      <Input value={value} onBlur={onBlur} onChange={onChange} />
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
