import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import type { FieldProps } from "./types";
import { getRules } from "./utils";

interface BaseFieldProps<T extends FieldValues> extends FieldProps<T> {
  isRequired?: boolean;
}

export const BaseField = <T extends FieldValues>({
  control,
  name,
  type,
  isDisabled,
  isRequired = false,
}: BaseFieldProps<T>) => {
  const {
    field: { value, onBlur, onChange, ...fieldProps },
    fieldState: { isTouched, isDirty, error },
  } = useController({
    name,
    control,
    rules: getRules<T>(type, isRequired),
  });
  const isError = (isTouched || isDirty) && !!error;

  return (
    <FormControl isInvalid={isError} isDisabled={isDisabled} {...fieldProps}>
      <Input value={value} onBlur={onBlur} onChange={onChange} />
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
