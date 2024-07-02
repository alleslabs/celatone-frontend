import { Text } from "@chakra-ui/react";
import { components } from "chakra-react-select";
import type { NoticeProps } from "chakra-react-select";

import type { VerifyPublishCodeOpiton } from "./verifyPublishCodeSelectInput";

export const VerifyPublishCodeInputNoOptionsMessage = (
  props: NoticeProps<VerifyPublishCodeOpiton>
) => (
  <components.NoOptionsMessage {...props}>
    <Text px={3} textAlign="left" variant="body2">
      No matching supported compiler version found
    </Text>
  </components.NoOptionsMessage>
);
