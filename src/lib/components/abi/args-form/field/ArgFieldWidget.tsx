import { Input, Textarea } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import type { ControllerRenderProps } from "react-hook-form";

import { useExampleAddresses } from "lib/app-provider";
import type { HumanAddr, Nullable } from "lib/types";

import { UintTypes } from "./utils";

const STRING_TYPE = "0x1::string::String";

const getInputPlaceholder = (type: string, isNull: boolean) => {
  if (type === STRING_TYPE && !isNull)
    return "Left blank to send as empty string";
  return " ";
};

const getVectorPlaceholder = (
  type: string,
  isNull: boolean,
  sampleAddresses: HumanAddr
) => {
  if (isNull) return " ";
  const [, elementType] = type.split(/<(.*)>/);

  if (UintTypes.includes(elementType)) return "[1, 2, 3]";
  if (elementType === "address") return `[0x1, ${sampleAddresses}]`;
  if (elementType === STRING_TYPE)
    return "[some first string, some second string]";
  if (elementType === "bool") return "[true, false]";
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
  const { user: exampleAddress } = useExampleAddresses();

  if (UintTypes.includes(type) || type === "address" || type === STRING_TYPE)
    return (
      <Input
        size="md"
        placeholder={getInputPlaceholder(type, value === null)}
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
          option: (provided, state) => ({
            ...provided,
            bg: state.isSelected ? "gray.800" : undefined,
            color: "text.main",
            _hover: {
              bg: "gray.700",
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
