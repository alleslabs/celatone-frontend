import { Text } from "@chakra-ui/react";
import type { NoticeProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { SelectInputOption } from "lib/components/forms";

import type { WasmVerifySubmitFormOptionValue } from "./WasmVerifySubmitFormSelectOption";

export const WasmVerifySubmitFormSelectNoOptionsMessage = (
  props: NoticeProps<SelectInputOption<WasmVerifySubmitFormOptionValue>>
) => (
  <components.NoOptionsMessage {...props}>
    <Text px={3} textAlign="left" variant="body2">
      No matching supported compiler version found
    </Text>
  </components.NoOptionsMessage>
);
