import { FieldProps } from "./types";
import { FieldValues, useController } from "react-hook-form";
import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { getRules } from "./utils";

interface BaseFieldProps<T extends FieldValues> extends FieldProps<T> {
  isRequired?: boolean;
}

export const BaseField = <T extends FieldValues>({
  control,
  name,
  type,
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
    <FormControl isInvalid={isError} {...fieldProps}>
      <Input value={value} onBlur={onBlur} onChange={onChange} />
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
