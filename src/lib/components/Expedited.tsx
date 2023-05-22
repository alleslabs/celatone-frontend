import { Flex, Text, Highlight } from "@chakra-ui/react";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

const ExpeditedText = (
  <Text variant="body3">
    <Highlight
      query="pass a high quorum threshold of 66.6% within the first 24 hours of voting"
      styles={{ fontWeight: 700, whiteSpace: "wrap", color: "text.main" }}
    >
      An expedited governance proposal is required to pass a high quorum
      threshold of 66.6% within the first 24 hours of voting in order to pass.
    </Highlight>
  </Text>
);

interface ExpeditedProps {
  isActiveExpedited: boolean;
}
export const Expedited = ({ isActiveExpedited }: ExpeditedProps) => (
  <Tooltip label={ExpeditedText}>
    <Flex align="center">
      <CustomIcon
        name="expedited"
        boxSize="4"
        ml="0"
        color={isActiveExpedited ? "accent.main" : "gray.400"}
      />
      <Text
        variant="body3"
        color={isActiveExpedited ? "accent.main" : "text.dark"}
      >
        Expedited
      </Text>
    </Flex>
  </Tooltip>
);
