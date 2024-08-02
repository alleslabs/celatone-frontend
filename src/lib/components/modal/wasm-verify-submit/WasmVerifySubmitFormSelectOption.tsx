import { Box, Text } from "@chakra-ui/react";
import type { OptionProps } from "chakra-react-select";
import { components } from "chakra-react-select";

export interface WasmVerifySubmitFormOption {
  label: string;
  value: string;
  version: string;
  lastUpdated: Date;
}

export const WasmVerifySubmitFormSelectOption = (
  props: OptionProps<WasmVerifySubmitFormOption>
) => {
  const { isSelected, data } = props;

  return (
    <Box
      sx={{
        "> div": {
          background: isSelected ? "gray.800" : "gray.900",
          "&:hover": {
            background: "gray.800",
          },
        },
      }}
    >
      <components.Option {...props}>
        <Text variant="body2">{data.label}</Text>
      </components.Option>
    </Box>
  );
};
