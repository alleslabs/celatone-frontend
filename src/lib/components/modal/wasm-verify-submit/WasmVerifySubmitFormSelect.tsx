import type { SystemStyleObject } from "@chakra-ui/react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Box, Text } from "@chakra-ui/react";
import { SelectInput } from "lib/components/forms";
import { useController, useWatch } from "react-hook-form";

import type {
  WasmVerifySubmitFormOption,
  WasmVerifySubmitFormOptionValue,
} from "./WasmVerifySubmitFormSelectOption";

import { WasmVerifySubmitFormSelectNoOptionsMessage } from "./WasmVerifySubmitFormSelectNoOptionsMessage";
import { WasmVerifySubmitFormSelectOption } from "./WasmVerifySubmitFormSelectOption";

interface WasmVerifySubmitFormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  options: WasmVerifySubmitFormOption[];
}

export const WasmVerifySubmitFormSelect = <T extends FieldValues>({
  control,
  name,
  options,
}: WasmVerifySubmitFormSelectProps<T>) => {
  const watcher = useWatch({
    control,
    name,
  });

  const { field } = useController<T>({
    control,
    name,
  });

  return (
    <Box
      position="relative"
      sx={{
        "& .form-label": {
          "::after": {
            color: "error.main",
            content: '"* (Required)"',
            ml: 1,
          },
          backgroundColor: "gray.800",
          color: "text.dark",
          fontSize: "12px",
          letterSpacing: "0.15px",
          ml: 3,
          position: "absolute",
          px: 1,
          top: -2,

          zIndex: 1,
        },
      }}
    >
      <Text className="form-label">Compiler version</Text>
      <SelectInput<WasmVerifySubmitFormOptionValue>
        chakraStyles={{
          placeholder: (provided: SystemStyleObject) => ({
            ...provided,
            color: "gray.600",
            fontSize: "16px",
            whiteSpace: "nowrap",
          }),
        }}
        components={{
          NoOptionsMessage: WasmVerifySubmitFormSelectNoOptionsMessage,
          Option: WasmVerifySubmitFormSelectOption,
        }}
        menuPortalTarget={undefined}
        options={options}
        placeholder="Select or input the compiler version"
        value={options.find((option) => option.value === watcher)}
        onChange={(newValue) => {
          const val = newValue as { label: string; value: string };
          return field.onChange(val.value);
        }}
      />
    </Box>
  );
};
