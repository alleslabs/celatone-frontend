import { Box, Text } from "@chakra-ui/react";
import type { OptionProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { SelectInputOption } from "lib/components/forms";

export type WasmVerifySubmitFormOption =
  SelectInputOption<WasmVerifySubmitFormOptionValue>;

export type WasmVerifySubmitFormOptionValue = string;

export const WasmVerifySubmitFormSelectOption = (
  props: OptionProps<SelectInputOption<WasmVerifySubmitFormOptionValue>>
) => {
  const { data, isSelected } = props;

  return (
    <Box
      sx={{
        "> div": {
          "&:hover": {
            background: "gray.800",
          },
          background: isSelected ? "gray.800" : "gray.900",
        },
      }}
    >
      <components.Option {...props}>
        <Text variant="body2">{data.label}</Text>
      </components.Option>
    </Box>
  );
};
