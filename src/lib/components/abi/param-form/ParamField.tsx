import { parseInt } from "lodash";
import type {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

import { ControllerInput } from "lib/components/forms";

interface ParamFieldProps<T extends FieldValues> {
  index: number;
  param: string;
  control: Control<T>;
  error?: string;
  isReadOnly?: boolean;
}

const getRules = <T extends FieldValues>(
  param: string,
  isReadOnly: boolean
): UseControllerProps<T>["rules"] => {
  if (isReadOnly) return {};
  return {
    validate: {
      maxLength: (v: string) =>
        v.length <= 10 ? undefined : `${v.length} more than 10`,
      positive: (v) => (parseInt(v) > 0 ? undefined : `${v} need positive`),
      lessThanTen: (v) => parseInt(v) < 10,
    },
    // pattern: { value: /^\d+$/, message: "This input is number only." },
  };
};

export const ParamField = <T extends FieldValues>({
  index,
  param,
  control,
  error,
  isReadOnly = false,
}: ParamFieldProps<T>) => {
  return (
    <ControllerInput
      name={`${index}` as FieldPath<T>}
      control={control}
      label={param}
      variant="floating"
      rules={getRules<T>(param, isReadOnly)}
      error={error}
      isReadOnly={isReadOnly}
    />
  );
};
