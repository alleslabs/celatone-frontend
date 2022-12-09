import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Spinner,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import type { FormControlProps } from "@chakra-ui/react";
import type { HTMLInputTypeAttribute, ChangeEvent } from "react";
import { useCallback } from "react";
import { MdCheckCircle, MdOutlineWarning } from "react-icons/md";

import { useRestrictedNumberInput } from "lib/app-provider/hooks";

type ResponseState = "init" | "loading" | "success" | "error";

export interface FormStatus {
  state: ResponseState;
  message?: string;
}

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
  const getStatusIcon = (state: ResponseState) => {
    switch (state) {
      case "loading":
        return <Spinner size="sm" />;
      case "success":
        return (
          <Icon color="success.main" as={MdCheckCircle} fontSize="1.2rem" />
        );
      case "error":
        return (
          <Icon color="error.light" as={MdOutlineWarning} fontSize="1.2rem" />
        );
      case "init":
      default:
        return null;
    }
  };

  const getResponseMsg = (statusInfo: FormStatus) => {
    switch (statusInfo.state) {
      case "success":
        return <Text color="success.main">{statusInfo.message}</Text>;
      case "error":
        return <Text color="error.light">{statusInfo.message}</Text>;
      case "init":
      case "loading":
      default:
        return <Text color="text.dark">{helperText}</Text>;
    }
  };

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
      isInvalid={!!error}
      size={size}
      {...componentProps}
    >
      <FormLabel
        className={value.length !== 0 ? "floating" : ""}
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
            {getStatusIcon(status.state)}
          </InputRightElement>
        )}
      </InputGroup>

      <FormErrorMessage>{error}</FormErrorMessage>
      {error ? (
        <FormErrorMessage className="error-text">{error}</FormErrorMessage>
      ) : (
        <FormHelperText className="helper-text">
          {status ? (
            getResponseMsg(status)
          ) : (
            <Text color="text.dark">{helperText}</Text>
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
};
