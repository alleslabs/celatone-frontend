import type { FormControlProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { FormStatus } from "./FormStatus";
import { getResponseMsg } from "./FormStatus";

// TODO: remove
export interface TextareaProps extends FormControlProps {
  value: string;
  setInputState: Dispatch<SetStateAction<string>> | ((newVal: string) => void);
  label?: string;
  labelBgColor?: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  status?: FormStatus;
}

export const TextareaInput = ({
  value,
  setInputState,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  status,
  ...componentProps
}: TextareaProps) => (
  <FormControl
    isInvalid={!!error || status?.state === "error"}
    size="md"
    {...componentProps}
  >
    {label && (
      <FormLabel className="textarea-label" bgColor={labelBgColor}>
        {label}
      </FormLabel>
    )}
    <Textarea
      resize="none"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setInputState(e.target.value)}
    />
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
  </FormControl>
);
