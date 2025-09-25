import { Input } from "@chakra-ui/react";
import { useCurrentChain } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";

import {
  BIG_DECIMAL_TYPE,
  FIXED_POINT_TYPES,
  OBJECT_TYPE,
  STRING_TYPE,
  UINT_NUMBER_TYPES,
  UINT_STRING_TYPES,
} from "../constants";
import { JsonTextarea } from "./json-textarea";
import { type ArgFieldWidgetProps, boolOptions } from "./types";
import { UintNumberInput } from "./uint-number-input";

const getInputPlaceholder = (
  type: string,
  isNull: boolean,
  addressPrefix: string
) => {
  if (type === STRING_TYPE && !isNull)
    return "Left blank to send as empty string";
  if (type.startsWith(OBJECT_TYPE)) return `0xabc4... or ${addressPrefix}1...`;
  return " ";
};

export const ArgFieldWidget = ({
  onChange,
  type,
  value,
}: ArgFieldWidgetProps) => {
  const { bech32Prefix } = useCurrentChain();

  if (UINT_NUMBER_TYPES.includes(type))
    return <UintNumberInput type={type} value={value} onChange={onChange} />;

  if (
    UINT_STRING_TYPES.includes(type) ||
    type === "address" ||
    type === STRING_TYPE ||
    type.startsWith(OBJECT_TYPE) ||
    FIXED_POINT_TYPES.includes(type) ||
    type === BIG_DECIMAL_TYPE
  )
    return (
      <Input
        placeholder={getInputPlaceholder(type, value === null, bech32Prefix)}
        size="md"
        value={value ? value.toString() : ""}
        onChange={onChange}
      />
    );

  if (type === "bool")
    return (
      <SelectInput
        classNamePrefix="chakra-react-select"
        menuPortalTarget={
          typeof window !== "undefined" ? document.body : undefined
        }
        options={boolOptions}
        placeholder=""
        size="md"
        value={boolOptions.find(
          ({ value: optionValue }) => optionValue === value
        )}
        onChange={(newValue) => onChange(newValue?.value)}
      />
    );

  return <JsonTextarea type={type} value={value} onChange={onChange} />;
};
