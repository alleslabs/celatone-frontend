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
  extends Omit<TextInputProps, "setInputState" | "type" | "value"> {
  control: Control<T>;
  cta?: {
    label: string;
    onClick: (changeValue?: (...event: string[]) => void) => void;
  };
  helperAction?: ReactNode;
  maxLength?: number;
  name: FieldPath<T>;
  restrictedNumberInputParams?: Pick<
    RestrictedNumberInputParams,
    "maxDecimalPoints" | "maxIntegerPoints"
  >;
  rules?: UseControllerProps["rules"];
  status?: FormStatus;
  textAlign?: "left" | "right";
  type?: "decimal" | "number" | "text";
}

export const ControllerInput = <T extends FieldValues>({
  autoFocus,
  control,
  cta,
  cursor,
  error,
  helperAction,
  helperText,
  label,
  labelBgColor = "background.main",
  maxLength,
  name,
  placeholder = " ",
  restrictedNumberInputParams,
  rules = {},
  size = "lg",
  status,
  textAlign = "left",
  type = "text",
  ...componentProps
}: ControllerInputProps<T>) => {
  const watcher = useWatch({
    control,
    name,
  });

  const {
    field,
    fieldState: { isDirty, isTouched },
  } = useController<T>({
    control,
    name,
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
    onChange: field.onChange,
    type: "decimal",
    ...restrictedNumberInputParams,
  });

  const numberHandlers = useRestrictedNumberInput({
    maxDecimalPoints: 0,
    maxIntegerPoints: 7,
    onChange: field.onChange,
    type: "integer",
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
            <Text as="span" pl={1} color="error.main">
              * (Required)
            </Text>
          }
        >
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <Input
          maxLength={maxLength}
          pr={inputPaddingRight()}
          size={size}
          type="text"
          value={watcher}
          autoFocus={autoFocus}
          cursor={cursor}
          onBlur={field.onBlur}
          onChange={field.onChange}
          placeholder={placeholder}
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
              variant="body2"
              color="primary.main"
              cursor="pointer"
              onClick={() => cta.onClick(field.onChange)}
            >
              {cta.label}
            </Text>
          )}
        </InputRightElement>
      </InputGroup>
      <Flex alignItems="center" gap={1} mt={1} justifyContent="space-between">
        <Flex gap={1} direction="column">
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
