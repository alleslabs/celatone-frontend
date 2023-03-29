import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useWatch, useController } from "react-hook-form";

import type { FormStatus } from "./FormStatus";
import { getStatusIcon, getResponseMsg } from "./FormStatus";
import type { TextInputProps } from "./TextInput";

interface ControllerInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps["rules"];
  status?: FormStatus;
  maxLength?: number;
  helperAction?: ReactNode;
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
  status,
  maxLength,
  helperAction,
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
  const isRequired = "required" in rules;

  return (
    <FormControl
      size={size}
      isInvalid={isError || status?.state === "error"}
      isRequired={isRequired}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel className={`${size}-label`} bgColor={labelBgColor}>
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <Input
          size={size}
          placeholder={placeholder}
          type={type}
          value={watcher}
          onChange={field.onChange}
          maxLength={maxLength}
        />
        <InputRightElement h="full">
          {status && getStatusIcon(status.state)}
        </InputRightElement>
      </InputGroup>
      <Flex gap={1} alignItems="center" mt={1}>
        {isError ? (
          <FormErrorMessage className="error-text">{error}</FormErrorMessage>
        ) : (
          <FormHelperText className="helper-text">
            {status?.message ? getResponseMsg(status, helperText) : helperText}
          </FormHelperText>
        )}
        {helperAction}
      </Flex>
    </FormControl>
  );
};
