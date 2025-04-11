import type { SelectInputOption } from "lib/components/forms";
import type { FieldValues } from "react-hook-form";

import { SelectInput } from "lib/components/forms";
import { useController } from "react-hook-form";

import type { FieldProps } from "./types";

const BOOL_FIELD_OPTIONS: SelectInputOption<boolean>[] = [
  {
    label: "True",
    value: true,
  },
  {
    label: "False",
    value: false,
  },
];

export const BoolField = <T extends FieldValues>({
  control,
  name,
  isDisabled,
}: FieldProps<T>) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
  });

  return (
    <SelectInput
      isDisabled={isDisabled}
      menuPortalTarget={document.body}
      options={BOOL_FIELD_OPTIONS}
      size="md"
      value={BOOL_FIELD_OPTIONS.find((option) => option.value === value)}
      onChange={(newValue) => {
        if (!newValue) return;
        onChange(newValue.value);
      }}
    />
  );
};
