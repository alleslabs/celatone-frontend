import type { NoticeProps } from "chakra-react-select";
import type { AssetOptionValue } from "lib/types";

import { Text } from "@chakra-ui/react";
import { components } from "chakra-react-select";

import type { SelectInputOption } from "../SelectInput";

export const AssetInputNoOptionsMessage = (
  props: NoticeProps<SelectInputOption<AssetOptionValue>>
) => (
  <components.NoOptionsMessage {...props}>
    <Text py={4}>No matching assets found</Text>
  </components.NoOptionsMessage>
);
