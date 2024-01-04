import { Input, Textarea } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import type { ControllerRenderProps } from "react-hook-form";

import { useCurrentChain, useExampleAddresses } from "lib/app-provider";
import type { BechAddr20, Nullable } from "lib/types";

import {
  UINT_TYPES,
  STRING_TYPE,
  OBJECT_TYPE,
  FIXED_POINT_TYPES,
  DECIMAL_TYPES,
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
  type: string;
  value: Nullable<string>;
  onChange: ControllerRenderProps["onChange"];
}

export const ArgFieldWidget = ({
  type,
  value,
  onChange,
}: ArgFieldWidgetProps) => {
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();
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
        placeholder={getInputPlaceholder(type, value === null, prefix)}
        value={value ?? ""}
        onChange={onChange}
      />
    );

  if (type === "bool")
    return (
      <Select
        classNamePrefix="chakra-react-select"
        size="md"
        options={boolOptions}
        placeholder={" "}
        value={boolOptions.find(
          ({ value: optionValue }) => optionValue === value
        )}
        onChange={(e) => onChange(e?.value)}
        menuPosition="fixed"
        menuPortalTarget={document.querySelector("body")}
        chakraStyles={{
          control: (provided) => ({
            ...provided,
            _disabled: {
              color: "text.main",
            },
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isDisabled ? "gray.700" : undefined,
          }),
          option: (provided) => ({
            ...provided,
            color: "text.main",
            _hover: {
              bg: "gray.700",
            },
            _selected: {
              bg: "gray.800",
            },
          }),
        }}
      />
    );

  return (
    <Textarea
      minH="112px"
      h="fit-content"
      placeholder={
        type.startsWith("vector")
          ? getVectorPlaceholder(type, value === null, exampleAddress)
          : " "
      }
      value={value ?? ""}
      onChange={onChange}
    />
  );
};
