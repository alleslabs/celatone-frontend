import type { FormControlProps } from "@chakra-ui/react";
import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useRestrictedNumberInput } from "lib/app-provider/hooks";
import { useCallback } from "react";

import type { FormStatus } from "./FormStatus";

import { getResponseMsg, getStatusIcon } from "./FormStatus";

/** TODO: refactor later */
export interface NumberInputProps extends FormControlProps {
  value: string;
  onInputChange: (nextValue: string) => void;
  label: string;
  labelBgColor?: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  status?: FormStatus;
}

export const NumberInput = ({
  error,
  helperText,
  label,
  labelBgColor = "background.main",
  onInputChange,
  placeholder = " ",
  size = "lg",
  status,
  value,
  ...componentProps
}: NumberInputProps) => {
  const inputOnChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onInputChange(target.value);
    },
    [onInputChange]
  );

  const handlers = useRestrictedNumberInput({
    maxDecimalPoints: 0,
    maxIntegerPoints: 7,
    onChange: inputOnChange,
    type: "integer",
  });

  // Design system size: md = 40px, lg = 56px
  return (
    <FormControl
      isInvalid={!!error || status?.state === "error"}
      size={size}
      {...componentProps}
    >
      <FormLabel className={`${size}-label`} backgroundColor={labelBgColor}>
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          placeholder={placeholder}
          pr={status && "36px"}
          size={size}
          value={value}
          {...handlers}
        />
        {status && (
          <InputRightElement h="full">
            {getStatusIcon(status.state, "1.2em")}
          </InputRightElement>
        )}
      </InputGroup>

      <Box mt={1}>
        {error ? (
          <FormErrorMessage className="error-text">{error}</FormErrorMessage>
        ) : (
          <FormHelperText className="helper-text">
            {status?.message ? getResponseMsg(status, helperText) : helperText}
          </FormHelperText>
        )}
      </Box>
    </FormControl>
  );
};
