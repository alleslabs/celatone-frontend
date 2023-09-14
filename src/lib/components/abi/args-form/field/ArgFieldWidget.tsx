import { Input, Textarea } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import type { ControllerRenderProps } from "react-hook-form";

import type { Option } from "lib/types";

import { UintTypes } from "./utils";

const getInputPlaceholder = (type: string, isNull: boolean) => {
  if (type === "0x1::string::String" && !isNull)
    return "Left blank to send as empty string";
  if (type === "&signer") return "Signer is auto-filled when signing a tx";
  return " ";
};

const boolOptions = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
];

interface ArgFieldWidgetProps {
  type: string;
  watcher: Option<string>;
  onChange: ControllerRenderProps["onChange"];
}

export const ArgFieldWidget = ({
  type,
  watcher,
  onChange,
}: ArgFieldWidgetProps) => {
  if (
    UintTypes.includes(type) ||
    type === "address" ||
    type === "0x1::string::String" ||
    type === "&signer"
  )
    return (
      <Input
        size="md"
        placeholder={getInputPlaceholder(type, watcher === undefined)}
        value={watcher ?? ""}
        onChange={onChange}
      />
    );

  if (type === "bool")
    return (
      <Select
        classNamePrefix="chakra-react-select"
        size="md"
        options={boolOptions}
        value={boolOptions.find(({ value }) => value === watcher)}
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
      placeholder={" "}
      value={watcher ?? ""}
      onChange={onChange}
    />
  );
};
