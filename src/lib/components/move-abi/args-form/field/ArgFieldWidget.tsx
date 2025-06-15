import type { BechAddr20, Nullable } from "lib/types";
import type { ControllerRenderProps } from "react-hook-form";

import { Input, Textarea } from "@chakra-ui/react";
import { useCurrentChain, useExampleAddresses } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";
import { bech32AddressToHex } from "lib/utils";
import { useState } from "react";

import {
  BIG_DECIMAL_TYPE,
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

  if (UINT_TYPES.includes(elementType)) return '["1", "2", "3"]';
  if (elementType === "address" || elementType.startsWith(OBJECT_TYPE))
    return `["0x1", "${bech32AddressToHex(sampleAddress)}"]`;
  if (elementType === STRING_TYPE)
    return '["some first string", "some second string"]';
  if (elementType === "bool") return "[true, false]";
  if (
    FIXED_POINT_TYPES.includes(elementType) ||
    elementType === BIG_DECIMAL_TYPE
  )
    return '["1", "1.2", "1.23", "12.34"]';
  return `["${elementType}"]`;
};

const boolOptions = [
  { label: "True", value: true },
  { label: "False", value: false },
];

interface ArgFieldWidgetProps {
  onChange: ControllerRenderProps["onChange"];
  type: string;
  value: Nullable<unknown>;
}

const JsonTextarea = ({ onChange, type, value }: ArgFieldWidgetProps) => {
  const { user: exampleAddress } = useExampleAddresses();

  const [fieldValue, setFieldValue] = useState(
    typeof value === "string" ? value : JSON.stringify(value)
  );

  return (
    <Textarea
      h="fit-content"
      minH="112px"
      placeholder={
        type.startsWith("vector")
          ? getVectorPlaceholder(type, value === null, exampleAddress)
          : " "
      }
      value={fieldValue}
      onChange={(newValue) => {
        setFieldValue(newValue.target.value);
        try {
          onChange(JSON.parse(newValue.target.value));
        } catch {
          onChange(newValue.target.value);
        }
      }}
    />
  );
};

export const ArgFieldWidget = ({
  onChange,
  type,
  value,
}: ArgFieldWidgetProps) => {
  const { bech32Prefix } = useCurrentChain();

  if (
    UINT_TYPES.includes(type) ||
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
        menuPortalTarget={document.body}
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
