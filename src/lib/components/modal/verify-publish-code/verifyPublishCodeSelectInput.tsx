import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useController, useWatch } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { VerifyPublishCodeInputNoOptionsMessage } from "./verifyPublishCodeInputNoOptionsMessage";
import { VerifyPublishCodeInputOption } from "./verifyPublishCodeInputOption";

export interface VerifyPublishCodeOpiton {
  label: string;
  value: string;
  version: string;
  lastUpdated: Date;
}

interface VerifyPublishCodeSelectInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  options: VerifyPublishCodeOpiton[];
}

const dropdownStyles = {
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
};

export const VerifyPublishCodeSelectInput = <T extends FieldValues>({
  name,
  control,
  options,
}: VerifyPublishCodeSelectInputProps<T>) => {
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
      <Select
        size="lg"
        placeholder="Select or input the compiler version"
        options={options}
        onChange={(newValue) => {
          const val = newValue as { label: string; value: string };
          return field.onChange(val.value);
        }}
        chakraStyles={dropdownStyles}
        filterOption={(
          candidate: { label: string; value: string },
          input: string
        ) => {
          if (input) {
            return candidate.label.toLowerCase().includes(input.toLowerCase());
          }

          return true;
        }}
        components={{
          NoOptionsMessage: VerifyPublishCodeInputNoOptionsMessage,
          Option: VerifyPublishCodeInputOption,
        }}
        value={options.find((option) => option.value === watcher) || null}
      />
    </Box>
  );
};
