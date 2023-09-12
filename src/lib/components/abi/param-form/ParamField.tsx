import { parseInt } from "lodash";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { ControllerInput } from "lib/components/forms";

interface ParamFieldProps<T extends FieldValues> {
  index: number;
  param: string;
  control: Control<T>;
  error?: string;
}

export const ParamField = <T extends FieldValues>({
  index,
  param,
  control,
  error,
}: ParamFieldProps<T>) => {
  return (
    <ControllerInput
      name={`${index}` as FieldPath<T>}
      control={control}
      label={param}
      variant="floating"
      rules={{
        validate: {
          positive: (v) => (parseInt(v) > 0 ? undefined : "need positive"),
          lessThanTen: (v) => parseInt(v) < 10,
        },
        // pattern: { value: /^\d+$/, message: "This input is number only." },
      }}
      error={error}
    />
  );
};
