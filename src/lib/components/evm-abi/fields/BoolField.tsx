import { SelectInput, SelectInputOption } from "lib/components/forms";
import { FieldValues, useController } from "react-hook-form";
import { FieldProps } from "./types";

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
    />
  );
};
