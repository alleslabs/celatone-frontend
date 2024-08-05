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

import type { RestrictedNumberInputParams } from "lib/app-provider";
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
          onChange={field.onChange}
          type="text"
          maxLength={maxLength}
          autoFocus={autoFocus}
          cursor={cursor}
          onBlur={field.onBlur}
          pr={inputPaddingRight()}
          {...(type === "decimal" && decimalHandlers)}
          {...(type === "number" && numberHandlers)}
          textAlign={textAlign}
        />
        <InputRightElement
          h="full"
          w={status || cta ? "2.5rem" : 0}
          pr={cta ? 3 : 0}
        >
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
