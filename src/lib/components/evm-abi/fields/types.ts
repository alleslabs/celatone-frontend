import type { JsonFragmentType } from "ethers";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FieldProps<T extends FieldValues>
  extends Omit<JsonFragmentType, "name"> {
  control: Control<T>;
  isDisabled?: boolean;
  label?: string;
  name: FieldPath<T>;
}
