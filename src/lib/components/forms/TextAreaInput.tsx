import type { FormControlProps } from "@chakra-ui/react";
import {
  FormErrorMessage,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

export interface TextAreaProps extends FormControlProps {
  value: string;
  setInputState: Dispatch<SetStateAction<string>> | ((newVal: string) => void);
  label?: string;
  labelBgColor?: string;
  helperText?: string;
  error?: string;
  rows?: number;
}

export const TextAreaInput = ({
  value,
  setInputState,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder = " ",
  error,
  ...componentProps
}: TextAreaProps) => {
  return (
    <FormControl
      className="textarea-form"
      isInvalid={!!error}
      size="md"
      {...componentProps}
    >
      {label && (
        <FormLabel
          bgColor={labelBgColor}
          className={value.length ? "floating" : ""}
        >
          {label}
        </FormLabel>
      )}
      <Textarea
        resize="none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setInputState(e.target.value)}
      />
      <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      {!error && (
        <FormHelperText className="helper-text">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
