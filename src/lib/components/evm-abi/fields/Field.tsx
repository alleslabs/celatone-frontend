import type { FieldValues } from "react-hook-form";
import { BaseField } from "./BaseField";
import { BoolField } from "./BoolField";
import { TupleField } from "./TupleField";
import type { FieldProps } from "./types";

export const Field = <T extends FieldValues>({
  type,
  components,
  ...rest
}: FieldProps<T>) => {
  if (components)
    return <TupleField type={type} components={components} {...rest} />;
  if (type?.startsWith("bool")) return <BoolField type={type} {...rest} />;
  return <BaseField type={type} isRequired {...rest} />;
};
