import { Flex, Tooltip, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

const expeditedText = (
  <>
    An expedited governance proposal is required to{" "}
    <span style={{ fontWeight: 700 }}>
      pass a high quorum threshold of 66.6% within the first 24 hours of voting
    </span>{" "}
    in order to pass.
  </>
);

interface ExpeditedProps {
  isActiveExpedited: boolean;
}
export const Expedited = ({ isActiveExpedited }: ExpeditedProps) => (
  <Tooltip
    hasArrow
    label={expeditedText}
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
