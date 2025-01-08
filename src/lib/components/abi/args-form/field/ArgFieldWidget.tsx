import { Input, Textarea } from "@chakra-ui/react";
import type { ControllerRenderProps } from "react-hook-form";

import { useCurrentChain, useExampleAddresses } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";
import type { BechAddr20, Nullable } from "lib/types";

import {
  DECIMAL_TYPES,
  FIXED_POINT_TYPES,
  OBJECT_TYPE,
  STRING_TYPE,
  UINT_TYPES,
} from "./constants";

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

const getVectorPlaceholder = (
  type: string,
  isNull: boolean,
  sampleAddress: BechAddr20
) => {
  if (isNull) return " ";
  const [, elementType] = type.split(/<(.*)>/);

  if (UINT_TYPES.includes(elementType)) return "[1, 2, 3]";
  if (elementType === "address" || elementType.startsWith(OBJECT_TYPE))
    return `[0x1, ${sampleAddress}]`;
  if (elementType === STRING_TYPE)
    return "[some first string, some second string]";
  if (elementType === "bool") return "[true, false]";
  if (
    FIXED_POINT_TYPES.includes(elementType) ||
    DECIMAL_TYPES.includes(elementType)
  )
    return "[1, 1.2, 1.23, 12.34]";
  return `[${elementType}]`;
};

const boolOptions = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
];

interface ArgFieldWidgetProps {
  onChange: ControllerRenderProps["onChange"];
  type: string;
  value: Nullable<string>;
}

export const ArgFieldWidget = ({
  onChange,
  type,
  value,
}: ArgFieldWidgetProps) => {
  const { bech32Prefix } = useCurrentChain();
  const { user: exampleAddress } = useExampleAddresses();

  if (
    UINT_TYPES.includes(type) ||
    type === "address" ||
    type === STRING_TYPE ||
    type.startsWith(OBJECT_TYPE) ||
    FIXED_POINT_TYPES.includes(type) ||
    DECIMAL_TYPES.includes(type)
  )
    return (
      <Input
        size="md"
        value={value ?? ""}
        onChange={onChange}
        placeholder={getInputPlaceholder(type, value === null, bech32Prefix)}
      />
    );

  if (type === "bool")
    return (
      <SelectInput
        size="md"
        value={boolOptions.find(
          ({ value: optionValue }) => optionValue === value
        )}
        menuPortalTarget={document.body}
        onChange={(newValue) => onChange(newValue?.value)}
        options={boolOptions}
        placeholder=""
        classNamePrefix="chakra-react-select"
      />
    );

  return (
    <Textarea
      h="fit-content"
      minH="112px"
      value={value ?? ""}
      onChange={onChange}
      placeholder={
        type.startsWith("vector")
          ? getVectorPlaceholder(type, value === null, exampleAddress)
          : " "
      }
    />
  );
};
