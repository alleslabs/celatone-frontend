import {
  InputRightElement,
  InputGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import type { FormControlProps } from "@chakra-ui/react";
import type { HTMLInputTypeAttribute, Dispatch, SetStateAction } from "react";
import { MdCheckCircle, MdOutlineWarning } from "react-icons/md";

type ResponseState = "init" | "loading" | "success" | "error";

export interface FormStatus {
  state: ResponseState;
  message?: string;
}

const getStatusIcon = (state: ResponseState) => {
  switch (state) {
    case "loading":
      return <Spinner size="sm" />;
    case "success":
      return <Icon color="success.main" as={MdCheckCircle} />;
    case "error":
      return <Icon color="error.light" as={MdOutlineWarning} />;
    case "init":
    default:
      return null;
  }
};

const getResponseMsg = (statusInfo: FormStatus, helperText = "") => {
  switch (statusInfo.state) {
    case "success":
      return <Text color="success.main">{statusInfo.message}</Text>;
    case "error":
      return <Text color="error.main">{statusInfo.message}</Text>;
    case "init":
    case "loading":
    default:
      return <Text color="text.dark">{helperText}</Text>;
  }
};

export interface TextInputProps extends FormControlProps {
  value: string;
  setInputState: Dispatch<SetStateAction<string>>;
  label?: string;
  labelBgColor?: string;
  helperText?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  status?: FormStatus;
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
  ...componentProps
}: TextInputProps) => {
  // Design system size: md = 40px, lg = 56px
  return (
    <FormControl
      className={`${size}-form`}
      isInvalid={!!error || status?.state === "error"}
      size={size}
      {...componentProps}
    >
      {label && (
        <FormLabel
          className={value.length ? "floating" : ""}
          backgroundColor={labelBgColor}
        >
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
        />
        <InputRightElement h="full">
          {status && getStatusIcon(status.state)}
        </InputRightElement>
      </InputGroup>

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
