import { Text } from "@chakra-ui/react";
import type { NoticeProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { AssetOption } from "./AssetInput";

export const AssetInputNoOptionsMessage = (props: NoticeProps<AssetOption>) => {
  return (
    <components.NoOptionsMessage {...props}>
      <Text py={4}>No matching assets found</Text>
    </components.NoOptionsMessage>
  );
};
