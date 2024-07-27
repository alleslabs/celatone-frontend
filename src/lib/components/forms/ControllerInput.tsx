import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useController, useWatch } from "react-hook-form";

import { useRestrictedNumberInput } from "lib/app-provider";

import type { FormStatus } from "./FormStatus";
import { getResponseMsg, getStatusIcon } from "./FormStatus";
import type { TextInputProps } from "./TextInput";

export interface ControllerInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState" | "type"> {
  name: FieldPath<T>;
  control: Control<T>;
  type?: "text" | "number" | "decimal";
  rules?: UseControllerProps["rules"];
  status?: FormStatus;
  maxLength?: number;
  helperAction?: ReactNode;
  cta?: {
    label: string;
    onClick: (changeValue?: (...event: string[]) => void) => void;
  };
}

export const ControllerInput = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  size = "lg",
  type = "text",
  rules = {},
  status,
  maxLength,
  autoFocus,
  cursor,
  helperAction,
  cta,
  ...componentProps
}: ControllerInputProps<T>) => {
  const watcher = useWatch({
    name,
    control,
  });

  const {
    field,
    fieldState: { isTouched, isDirty },
  } = useController<T>({
    name,
    control,
    rules,
  });

  const isError = (isTouched || isDirty) && !!error;
  const isRequired = "required" in rules;
  const inputPaddingRight = () => {
    if (status) {
      return "2rem";
    }

    if (cta) {
      return "3rem";
    }

    return 0;
  };

  const decimalHandlers = useRestrictedNumberInput({
    type: "decimal",
    maxIntegerPoinsts: 7,
    maxDecimalPoints: 6,
    onChange: field.onChange,
  });

  const numberHandlers = useRestrictedNumberInput({
    type: "integer",
    maxIntegerPoinsts: 7,
    maxDecimalPoints: 0,
    onChange: field.onChange,
  });

  return (
    <FormControl
      size={size}
      isInvalid={isError || status?.state === "error"}
      isRequired={isRequired}
      {...componentProps}
      {...field}
    >
      {label && (
        <FormLabel
          className={`${size}-label`}
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
      <InputGroup>
        <Input
          size={size}
          placeholder={placeholder}
          value={watcher}
          type="text"
          maxLength={maxLength}
          autoFocus={autoFocus}
          cursor={cursor}
          pr={inputPaddingRight()}
          {...(type === "decimal" && decimalHandlers)}
          {...(type === "number" && numberHandlers)}
          onBlur={field.onBlur}
        />
        <InputRightElement h="full" pr={cta ? 3 : 0}>
          {status && getStatusIcon(status.state)}
          {cta && (
            <Text
              bg="background.main"
              variant="body2"
              color="accent.main"
              onClick={() => cta.onClick(field.onChange)}
              cursor="pointer"
            >
              {cta.label}
            </Text>
          )}
        </InputRightElement>
      </InputGroup>
      <Flex gap={1} alignItems="center" mt={1} justifyContent="space-between">
        <Flex direction="column" gap={1}>
          {isError && (
            <FormErrorMessage className="error-text">{error}</FormErrorMessage>
          )}
          <FormHelperText className="helper-text">
            {status?.message ? getResponseMsg(status, helperText) : helperText}
          </FormHelperText>
        </Flex>
        {helperAction}
      </Flex>
    </FormControl>
  );
};
