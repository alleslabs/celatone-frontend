import type { SelectInputOption } from "lib/components/forms";
import { SelectInput } from "lib/components/forms";
import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import type { FieldProps } from "./types";

const BOOL_FIELD_OPTIONS: SelectInputOption<string>[] = [
  {
    label: "True",
    value: "1",
  },
  {
    label: "False",
    value: "0",
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
      options={BOOL_FIELD_OPTIONS}
      menuPortalTarget={document.body}
      value={BOOL_FIELD_OPTIONS.find((option) => option.value === value)}
      onChange={(newValue) => {
        if (!newValue) return;
        onChange(newValue.value);
      }}
      size="md"
      isDisabled={isDisabled}
    />
  );
};
