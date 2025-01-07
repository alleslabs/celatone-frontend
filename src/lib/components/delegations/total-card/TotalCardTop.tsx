import type { TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { TooltipInfo } from "lib/components/Tooltip";

interface TotalCardTopProps {
  fontWeight: TextProps["fontWeight"];
  message: string;
  title: string;
}

export const TotalCardTop = ({
  fontWeight,
  message,
  title,
}: TotalCardTopProps) => (
  <Flex alignItems="center" gap={2}>
    <Text variant="body2" fontWeight={fontWeight} textColor="text.dark">
      {title}
    </Text>
    <TooltipInfo label={message} />
  </Flex>
);
