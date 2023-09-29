/* eslint-disable sonarjs/cognitive-complexity */
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { type Control, useController } from "react-hook-form";

import { useValidateAddress } from "lib/app-provider";
import type { AbiFormData } from "lib/types";

import { ArgFieldWidget } from "./ArgFieldWidget";
import { getRules } from "./utils";

interface ArgFieldTemplateProps {
  index: number;
  param: string;
  control: Control<AbiFormData["args"]>;
}

export const ArgFieldTemplate = ({
  index,
  param,
  control,
}: ArgFieldTemplateProps) => {
  const [isEditted, setIsEditted] = useState(false);
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
  const rules = getRules(type, isOptional, isValidArgAddress);

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { isTouched, error },
  } = useController({
    name: `${index}`,
    control,
    rules,
  });
  const isError = (isTouched || isEditted) && !!error;

  const size = "md";
  const isNull = value === null;
  return (
    <Box>
      <FormControl
        className={`${size}-form`}
        variant={
          (type === "0x1::string::String" || type.startsWith("vector")) &&
          !isNull
            ? "fixed-floating"
            : "floating"
        }
        size={size}
        isInvalid={isError}
        isDisabled={isNull}
        {...fieldProps}
      >
        <ArgFieldWidget
          type={type}
          value={value}
          onChange={(e) => {
            setIsEditted(true);
            onChange(e);
          }}
        />
        <FormLabel className={`${size}-label`} bgColor="background.main">
          {param}
        </FormLabel>

        {isError && (
          <FormErrorMessage className="error-text" mt={1}>
            {error.message}
          </FormErrorMessage>
        )}
      </FormControl>
      {isOptional && (
        <Checkbox
          pt="2px"
          pl={2}
          isChecked={isNull}
          onChange={(e) => {
            const newValue = e.target.checked;
            onChange(newValue ? null : "");
          }}
        >
          <Text variant="body3">Send as null</Text>
        </Checkbox>
      )}
    </Box>
  );
};
