import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useController, useWatch } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { SelectInput } from "lib/components/forms";

import { WasmVerifySubmitFormSelectNoOptionsMessage } from "./WasmVerifySubmitFormSelectNoOptionsMessage";
import type {
  WasmVerifySubmitFormOption,
  WasmVerifySubmitFormOptionValue,
} from "./WasmVerifySubmitFormSelectOption";
import { WasmVerifySubmitFormSelectOption } from "./WasmVerifySubmitFormSelectOption";

interface WasmVerifySubmitFormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  options: WasmVerifySubmitFormOption[];
}

export const WasmVerifySubmitFormSelect = <T extends FieldValues>({
  name,
  control,
  options,
}: WasmVerifySubmitFormSelectProps<T>) => {
  const watcher = useWatch({
    name,
    control,
  });

  const { field } = useController<T>({
    name,
    control,
  });

  return (
    <Box
      position="relative"
      sx={{
        "& .form-label": {
          fontSize: "12px",
          color: "text.dark",
          backgroundColor: "gray.800",
          letterSpacing: "0.15px",
          position: "absolute",
          ml: 3,
          px: 1,
          top: -2,
          zIndex: 1,

          "::after": {
            content: '"* (Required)"',
            color: "error.main",
            ml: 1,
          },
        },
      }}
    >
      <Text className="form-label">Compiler Version</Text>
      <SelectInput<WasmVerifySubmitFormOptionValue>
        placeholder="Select or input the compiler version"
        options={options}
        menuPortalTarget={undefined}
        onChange={(newValue) => {
          const val = newValue as { label: string; value: string };
          return field.onChange(val.value);
        }}
        value={options.find((option) => option.value === watcher)}
        components={{
          NoOptionsMessage: WasmVerifySubmitFormSelectNoOptionsMessage,
          Option: WasmVerifySubmitFormSelectOption,
        }}
        chakraStyles={{
          container: (provided: SystemStyleObject) => ({
            ...provided,
            width: "100%",
          }),
          valueContainer: (provided: SystemStyleObject) => ({
            ...provided,
            pl: 3,
            pr: 0,
          }),
          dropdownIndicator: (provided: SystemStyleObject) => ({
            ...provided,
            px: 2,
            color: "gray.600",
          }),
          placeholder: (provided: SystemStyleObject) => ({
            ...provided,
            color: "gray.600",
            fontSize: "16px",
            whiteSpace: "nowrap",
          }),
        }}
      />
    </Box>
  );
};
