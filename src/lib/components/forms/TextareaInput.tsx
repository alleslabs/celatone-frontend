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
  error?: string;
  helperText?: string;
  label?: string;
  labelBgColor?: string;
  placeholder?: string;
  setInputState: ((newVal: string) => void) | Dispatch<SetStateAction<string>>;
  status?: FormStatus;
  value: string;
}

export const TextareaInput = ({
  error,
  helperText,
  label,
  labelBgColor = "background.main",
  placeholder = " ",
  setInputState,
  status,
  value,
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
      value={value}
      onChange={(e) => setInputState(e.target.value)}
      placeholder={placeholder}
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
