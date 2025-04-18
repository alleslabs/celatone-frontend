import type { FormControlProps } from "@chakra-ui/react";
import type {
  Dispatch,
  HTMLInputTypeAttribute,
  ReactNode,
  SetStateAction,
} from "react";

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

import type { FormStatus } from "./FormStatus";

import { getResponseMsg, getStatusIcon } from "./FormStatus";

export interface TextInputProps extends FormControlProps {
  value: string;
  setInputState: Dispatch<SetStateAction<string>> | ((value: string) => void);
  label?: string;
  labelBgColor?: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  status?: FormStatus;
  maxLength?: number;
  helperAction?: ReactNode;
  autoFocus?: boolean;
}

export const TextInput = ({
  autoFocus = false,
  error,
  helperAction,
  helperText,
  label = "",
  labelBgColor = "background.main",
  maxLength,
  placeholder = " ",
  setInputState,
  size = "lg",
  status,
  type = "text",
  value,
  ...componentProps
}: TextInputProps) => (
  // Design system size: md = 40px, lg = 56px
  <FormControl
    isInvalid={!!error || status?.state === "error"}
    size={size}
    {...componentProps}
  >
    {label && (
      <FormLabel className={`${size}-label`} backgroundColor={labelBgColor}>
        {label}
      </FormLabel>
    )}

    <InputGroup>
      <Input
        autoFocus={autoFocus}
        maxLength={maxLength}
        placeholder={placeholder}
        pr={status && "36px"}
        size={size}
        type={type}
        value={value}
        onChange={(e) => setInputState(e.target.value)}
      />
      <InputRightElement h="full">
        {status && getStatusIcon(status.state, "16px")}
      </InputRightElement>
    </InputGroup>
    <Flex alignItems="center" flexDir="row" gap={1} mt={1}>
      {error ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text" mt={0}>
          {status?.message ? (
            getResponseMsg(status, helperText)
          ) : (
            <Text color="text.dark" variant="body3" wordBreak="break-word">
              {helperText}
            </Text>
          )}
        </FormHelperText>
      )}
      {helperAction}
    </Flex>
  </FormControl>
);
