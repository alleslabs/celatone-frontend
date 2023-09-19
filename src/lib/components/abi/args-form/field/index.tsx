/* eslint-disable sonarjs/cognitive-complexity */
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { type Control, useController } from "react-hook-form";

import { useValidateAddress } from "lib/app-provider";
import type { AbiFormData } from "lib/types";

import { ArgFieldWidget } from "./ArgFieldWidget";
import { getRules } from "./utils";

interface ArgFieldTemplateProps {
  index: number;
  param: string;
  control: Control<AbiFormData["args"]>;
  error?: string;
  isReadOnly?: boolean;
}

export const ArgFieldTemplate = ({
  index,
  param,
  control,
  error,
  isReadOnly = false,
}: ArgFieldTemplateProps) => {
  const { validateUserAddress, validateContractAddress, validateHexAddress } =
    useValidateAddress();

  const isValidArgAddress = useCallback(
    (input: string) =>
      validateUserAddress(input) === null ||
      validateContractAddress(input) === null ||
      validateHexAddress(input),
    [validateContractAddress, validateHexAddress, validateUserAddress]
  );

  const isOptional = param.startsWith("0x1::option::Option");
  const type = isOptional ? param.split(/<(.*)>/)[1] : param;
  const rules = getRules(type, isOptional, isReadOnly, isValidArgAddress);

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { isTouched },
  } = useController({
    name: `${index}`,
    control,
    rules,
  });
  const isError = isTouched && !!error;

  const size = "md";
  const isNull = value === undefined;
  return (
    <Box>
      <FormControl
        className={`${size}-form`}
        variant={
          type === "0x1::string::String" && !isNull
            ? "fixed-floating"
            : "floating"
        }
        size="md"
        isInvalid={isError}
        isReadOnly={isReadOnly}
        isDisabled={isNull}
        {...fieldProps}
      >
        <ArgFieldWidget type={type} value={value} onChange={onChange} />
        <FormLabel className={`${size}-label`} bgColor="background.main">
          {param}
        </FormLabel>

        {isError && (
          <FormErrorMessage className="error-text" mt={1}>
            {error}
          </FormErrorMessage>
        )}
      </FormControl>
      {isOptional && (
        <Checkbox
          pt="2px"
          pl={2}
          isChecked={value === undefined}
          onChange={(e) => onChange(e.target.checked ? undefined : "")}
        >
          <Text variant="body3">Send as null</Text>
        </Checkbox>
      )}
    </Box>
  );
};
