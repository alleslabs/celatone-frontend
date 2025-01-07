import type { ReactNode } from "react";
import { useCallback } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import { useExampleAddresses, useValidateAddress } from "lib/app-provider";
import type { FormStatus, TextInputProps } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import type { Option } from "lib/types";

interface AddressInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "setInputState" | "value"> {
  control: Control<T>;
  helperAction?: ReactNode;
  maxLength?: number;
  name: FieldPath<T>;
  requiredText?: string;
  validation?: RegisterOptions["validate"];
}

const getAddressStatus = (input: string, error: Option<string>): FormStatus => {
  if (error) return { message: error, state: "error" };
  if (!input) return { state: "init" };
  return { message: "Valid Address", state: "success" };
};

export const AddressInput = <T extends FieldValues>({
  control,
  error,
  helperAction,
  helperText,
  label,
  labelBgColor = "background.main",
  maxLength,
  name,
  placeholder,
  requiredText = "Address is empty",
  size = "lg",
  validation = {},
}: AddressInputProps<T>) => {
  const { user: exampleUserAddress } = useExampleAddresses();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const validateAddress = useCallback(
    (input: string) =>
      input && !!validateContractAddress(input) && !!validateUserAddress(input)
        ? "Invalid address or not exists."
        : undefined,
    [validateContractAddress, validateUserAddress]
  );

  const watcher = useWatch({
    control,
    name,
  });

  const status = getAddressStatus(watcher, error ?? validateAddress(watcher));

  return (
    <ControllerInput
      helperText={helperText}
      label={label}
      maxLength={maxLength}
      name={name}
      rules={{
        required: requiredText,
        validate: { validateAddress, ...validation },
      }}
      size={size}
      status={status}
      variant="fixed-floating"
      control={control}
      helperAction={helperAction}
      labelBgColor={labelBgColor}
      placeholder={placeholder ?? exampleUserAddress}
    />
  );
};
