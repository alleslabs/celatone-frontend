import type { JsonFragmentType } from "ethers";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FieldProps<T extends FieldValues>
  extends Omit<JsonFragmentType, "name"> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  isDisabled?: boolean;
}
