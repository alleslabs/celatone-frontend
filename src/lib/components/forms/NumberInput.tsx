import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import type { FormControlProps } from "@chakra-ui/react";
import type { HTMLInputTypeAttribute, ChangeEvent } from "react";
import { useCallback } from "react";

import { useRestrictedNumberInput } from "lib/app-provider/hooks";

import type { FormStatus } from "./FormStatus";
import { getResponseMsg, getStatusIcon } from "./FormStatus";

/** TODO: refactor later */
export interface NumberInputProps extends FormControlProps {
  value: string;
  onInputChange: (nextValue: string) => void;
  label: string;
  labelBgColor?: string;
  helperText?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  status?: FormStatus;
}

export const NumberInput = ({
  value,
  label,
  labelBgColor = "background.main",
  helperText,
  error,
  placeholder = " ",
  size = "lg",
  status,
  onInputChange,
  ...componentProps
}: NumberInputProps) => {
  const inputOnChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onInputChange(target.value);
    },
    [onInputChange]
  );

  const handlers = useRestrictedNumberInput({
    type: "integer",
    maxIntegerPoinsts: 7,
    maxDecimalPoints: 0,
    onChange: inputOnChange,
  });

  // Design system size: md = 40px, lg = 56px
  return (
    <FormControl
      className={`${size}-form`}
      isInvalid={!!error || status?.state === "error"}
      size={size}
      {...componentProps}
    >
      <FormLabel
        className={value.length ? "floating" : ""}
        backgroundColor={labelBgColor}
      >
        {label}
      </FormLabel>

      <InputGroup>
        <Input
          size={size}
          placeholder={placeholder}
          value={value}
          pr={status && "36px"}
          {...handlers}
        />
        {status && (
          <InputRightElement h="full">
            {getStatusIcon(status.state, "1.2em")}
          </InputRightElement>
        )}
      </InputGroup>

      <FormErrorMessage>{error}</FormErrorMessage>
      {error ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text">
          {status ? (
            getResponseMsg(status, helperText)
          ) : (
            <Text color="text.dark">{helperText}</Text>
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
};
