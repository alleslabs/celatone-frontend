import type { TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { TooltipInfo } from "lib/components/Tooltip";

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
  <Flex alignItems="center" gap={2}>
    <Text variant="body2" fontWeight={fontWeight} textColor="text.dark">
      {title}
    </Text>
    <TooltipInfo label={message} iconVariant="solid" />
  </Flex>
);
