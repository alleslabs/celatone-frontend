import type { ReactNode } from "react";
import { useCallback } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import { useValidateAddress } from "lib/app-provider";
import type { FormStatus, TextInputProps } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";

interface AddressInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState"> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps["rules"];
  maxLength?: number;
  helperAction?: ReactNode;
}

const getAddressStatus = (input: string, error?: string): FormStatus => {
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
  placeholder = "ex.cltn1ff1asdf7988aw49efa4vw9846789",
  error,
  size = "lg",
  rules = {},
  maxLength,
  helperAction,
}: AddressInputProps<T>) => {
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
      placeholder={placeholder}
      type="text"
      variant="floating"
      status={status}
      labelBgColor={labelBgColor}
      helperText={helperText}
      size={size}
      rules={rules}
      maxLength={maxLength}
      helperAction={helperAction}
    />
  );
};
