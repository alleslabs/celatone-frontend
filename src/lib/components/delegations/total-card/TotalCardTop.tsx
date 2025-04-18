import type { TextProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";
import { TooltipInfo } from "lib/components/Tooltip";

interface TotalCardTopProps {
  title: string;
  message: string;
  fontWeight: TextProps["fontWeight"];
}

export const TotalCardTop = ({
  fontWeight,
  message,
  title,
}: TotalCardTopProps) => (
  <Flex alignItems="center" gap={2}>
    <Text fontWeight={fontWeight} textColor="text.dark" variant="body2">
      {title}
    </Text>
    <TooltipInfo label={message} />
  </Flex>
);
