import { Flex, Tooltip, Text, Highlight } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

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
  <Tooltip
    hasArrow
    label={ExpeditedText}
    placement="top"
    bg="honeydew.darker"
    arrowSize={8}
  >
    <Flex align="center">
      <CustomIcon
        name="expedited"
        boxSize="4"
        ml="0"
        color={isActiveExpedited ? "honeydew.main" : "pebble.400"}
      />
      <Text
        variant="body3"
        color={isActiveExpedited ? "honeydew.main" : "text.dark"}
      >
        Expedited
      </Text>
    </Flex>
  </Tooltip>
);
