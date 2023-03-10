import {
  InputRightElement,
  InputGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import type { FormControlProps } from "@chakra-ui/react";
import type {
  HTMLInputTypeAttribute,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

import type { FormStatus } from "./FormStatus";
import { getResponseMsg, getStatusIcon } from "./FormStatus";

export interface TextInputProps extends FormControlProps {
  value: string;
  setInputState: Dispatch<SetStateAction<string>>;
  label?: string;
  labelBgColor?: string;
  helperText?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  status?: FormStatus;
  maxLength?: number;
  helperAction?: ReactNode;
}

export const TextInput = ({
  value,
  setInputState,
  label = "",
  labelBgColor = "background.main",
  helperText,
  error,
  placeholder = "",
  size = "lg",
  type = "text",
  status,
  maxLength,
  helperAction,
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
        size={size}
        placeholder={placeholder}
        type={type}
        value={value}
        pr={status && "36px"}
        onChange={(e) => setInputState(e.target.value)}
        maxLength={maxLength}
      />
      <InputRightElement h="full">
        {status && getStatusIcon(status.state, "20px")}
      </InputRightElement>
    </InputGroup>
    <Flex gap={1} alignItems="center" mt={1} flexDir="row">
      {error ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text">
          {status?.message ? (
            getResponseMsg(status, helperText)
          ) : (
            <Text color="text.dark">{helperText}</Text>
          )}
        </FormHelperText>
      )}
      {helperAction}
    </Flex>
  </FormControl>
);
