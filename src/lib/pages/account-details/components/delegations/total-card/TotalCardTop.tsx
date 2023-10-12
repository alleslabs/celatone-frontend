import { InfoIcon } from "@chakra-ui/icons";
import type { TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { Tooltip } from "lib/components/Tooltip";

interface TotalCardTopProps {
  title: string;
  message: string;
  fontWeight: TextProps["fontWeight"];
}

export const TotalCardTop = ({
  title,
  message,
  fontWeight,
}: TotalCardTopProps) => (
  <Flex alignItems="center" gap={1}>
    <Text variant="body2" fontWeight={fontWeight} textColor="text.dark">
      {title}
    </Text>
    <Tooltip label={message}>
      <InfoIcon color="gray.600" boxSize={3} cursor="pointer" />
    </Tooltip>
  </Flex>
);
