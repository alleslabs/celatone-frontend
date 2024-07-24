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
  extends Omit<TextInputProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  validation?: RegisterOptions["validate"];
  maxLength?: number;
  helperAction?: ReactNode;
  requiredText?: string;
}

const getAddressStatus = (input: string, error: Option<string>): FormStatus => {
  if (error) return { state: "error", message: error };
  if (!input) return { state: "init" };
  return { state: "success", message: "Valid Address" };
};

export const AddressInput = <T extends FieldValues>({
  name,
  control,
  label,
  labelBgColor = "background.main",
  helperText,
  placeholder,
  error,
  size = "lg",
  validation = {},
  maxLength,
  helperAction,
  requiredText = "Address is empty",
}: AddressInputProps<T>) => {
  const { user: exampleUserAddress } = useExampleAddresses();
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const validateAddress = useCallback(
    (input: string) =>
      input && !!validateContractAddress(input) && !!validateUserAddress(input)
        ? "Invalid address or not exists."
        : undefined,
    [validateContractAddress, validateUserAddress]
  );

  const watcher = useWatch({
    name,
    control,
  });

  const status = getAddressStatus(watcher, error ?? validateAddress(watcher));

  return (
    <ControllerInput
      name={name}
      control={control}
      label={label}
      placeholder={placeholder ?? exampleUserAddress}
      variant="fixed-floating"
      status={status}
      labelBgColor={labelBgColor}
      helperText={helperText}
      size={size}
      rules={{
        required: requiredText,
        validate: { validateAddress, ...validation },
      }}
      maxLength={maxLength}
      helperAction={helperAction}
    />
  );
};
