import { Text } from "@chakra-ui/react";
import type { NoticeProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { AssetOptionValue } from "lib/types";
import type { SelectInputOption } from "../SelectInput";

export const AssetInputNoOptionsMessage = (
  props: NoticeProps<SelectInputOption<AssetOptionValue>>
) => (
  <components.NoOptionsMessage {...props}>
    <Text py={4}>No matching assets found</Text>
  </components.NoOptionsMessage>
);
