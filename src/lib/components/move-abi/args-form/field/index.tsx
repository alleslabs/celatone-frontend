import type { AbiFormData } from "lib/types";
import type { Control } from "react-hook-form";

import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useValidateAddress } from "lib/app-provider";
import { isHexModuleAddress, isHexWalletAddress } from "lib/utils";
import { useCallback, useState } from "react";
import { useController } from "react-hook-form";

import { ArgFieldWidget } from "./ArgFieldWidget";
import { OBJECT_TYPE, STRING_TYPE } from "./constants";
import { getHelperText, getRules } from "./utils";

interface ArgFieldTemplateProps {
  control: Control<AbiFormData["args"]>;
  index: number;
  param: string;
}

export const ArgFieldTemplate = ({
  control,
  index,
  param,
}: ArgFieldTemplateProps) => {
  const [isEditted, setIsEditted] = useState(false);
  const { validateContractAddress } = useValidateAddress();

  const isValidArgAddress = useCallback(
    (input: string) => isHexWalletAddress(input) || isHexModuleAddress(input),
    []
  );
  const isValidArgObject = useCallback(
    (input: string) =>
      validateContractAddress(input) === null || isHexModuleAddress(input),
    [validateContractAddress]
  );

  const isOptional = param.startsWith("0x1::option::Option");
  const type = isOptional ? param.split(/<(.*)>/)[1] : param;
  const rules = getRules(type, isOptional, isValidArgAddress, isValidArgObject);

  const {
    field: { onChange, value, ...fieldProps },
    fieldState: { error, isTouched },
  } = useController({
    control,
    name: `${index}`,
    rules,
  });
  const isError = (isTouched || isEditted) && !!error;

  const size = "md";
  const isNull = value === null;
  return (
    <Box>
      <FormControl
        className={`${size}-form`}
        isDisabled={isNull}
        isInvalid={isError}
        size={size}
        variant={
          (type === STRING_TYPE ||
            type.startsWith("vector") ||
            type.startsWith(OBJECT_TYPE)) &&
          !isNull
            ? "fixed-floating"
            : "floating"
        }
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

        {isError ? (
          <FormErrorMessage className="error-text" mt={1}>
            {error.message}
          </FormErrorMessage>
        ) : (
          <FormHelperText className="helper-text" mt={1}>
            {getHelperText(type)}
          </FormHelperText>
        )}
      </FormControl>
      {isOptional && (
        <Checkbox
          isChecked={isNull}
          pl={2}
          pt="2px"
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
