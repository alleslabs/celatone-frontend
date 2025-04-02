import type { RestrictedNumberInputParams } from "lib/app-provider";
import type { ReactNode } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

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
import { useRestrictedNumberInput } from "lib/app-provider";
import { useController, useWatch } from "react-hook-form";

import type { FormStatus } from "./FormStatus";
import type { TextInputProps } from "./TextInput";

import { getResponseMsg, getStatusIcon } from "./FormStatus";

export interface ControllerInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState" | "type"> {
  name: FieldPath<T>;
  control: Control<T>;
  type?: "text" | "number" | "decimal";
  rules?: UseControllerProps<T>["rules"];
  status?: FormStatus;
  maxLength?: number;
  helperAction?: ReactNode;
  textAlign?: "left" | "right";
  cta?: {
    label: string;
    onClick: (changeValue?: (...event: string[]) => void) => void;
  };
  restrictedNumberInputParams?: Pick<
    RestrictedNumberInputParams,
    "maxDecimalPoints" | "maxIntegerPoints"
  >;
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
  textAlign = "left",
  cta,
  restrictedNumberInputParams,
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

    if (textAlign === "right") {
      return "1rem";
    }

    return 0;
  };

  const decimalHandlers = useRestrictedNumberInput({
    type: "decimal",
    onChange: field.onChange,
    ...restrictedNumberInputParams,
  });

  const numberHandlers = useRestrictedNumberInput({
    type: "integer",
    maxIntegerPoints: 7,
    maxDecimalPoints: 0,
    onChange: field.onChange,
  });

  return (
    <FormControl
      isInvalid={isError || status?.state === "error"}
      isRequired={isRequired}
      size={size}
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
          whiteSpace="nowrap"
        >
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <Input
          autoFocus={autoFocus}
          cursor={cursor}
          maxLength={maxLength}
          placeholder={placeholder}
          pr={inputPaddingRight()}
          size={size}
          type="text"
          value={watcher}
          onBlur={field.onBlur}
          onChange={field.onChange}
          {...(type === "decimal" && decimalHandlers)}
          {...(type === "number" && numberHandlers)}
          textAlign={textAlign}
        />
        <InputRightElement
          h="full"
          pr={cta ? 3 : 0}
          w={status || cta ? "2.5rem" : 0}
        >
          {status && getStatusIcon(status.state)}
          {cta && (
            <Text
              bg="background.main"
              color="primary.main"
              cursor="pointer"
              variant="body2"
              onClick={() => cta.onClick(field.onChange)}
            >
              {cta.label}
            </Text>
          )}
        </InputRightElement>
      </InputGroup>
      <Flex alignItems="center" gap={1} justifyContent="space-between" mt={1}>
        <Flex direction="column" gap={1}>
          {isError && (
            <FormErrorMessage className="error-text">{error}</FormErrorMessage>
          )}
          {(status?.message || helperText) && (
            <FormHelperText className="helper-text">
              {status?.message
                ? getResponseMsg(status, helperText)
                : helperText}
            </FormHelperText>
          )}
        </Flex>
        {helperAction}
      </Flex>
    </FormControl>
  );
};
