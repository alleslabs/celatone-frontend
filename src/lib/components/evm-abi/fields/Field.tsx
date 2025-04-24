import type { FieldValues } from "react-hook-form";

import type { FieldProps } from "./types";

import { BaseField } from "./BaseField";
import { BoolField } from "./BoolField";
import { TupleField } from "./TupleField";

export const Field = <T extends FieldValues>({
  components,
  type,
  ...rest
}: FieldProps<T>) => {
  if (components)
    return <TupleField components={components} type={type} {...rest} />;
  if (type?.startsWith("bool")) return <BoolField type={type} {...rest} />;
  return <BaseField isRequired type={type} {...rest} />;
};
