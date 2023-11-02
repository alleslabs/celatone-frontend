import type { TextProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
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
  <Flex alignItems="center" gap={2}>
    <Text variant="body2" fontWeight={fontWeight} textColor="text.dark">
      {title}
    </Text>
    <Tooltip label={message}>
      <div>
        <CustomIcon
          name="info-circle-solid"
          color="gray.600"
          boxSize={3}
          cursor="pointer"
        />
      </div>
    </Tooltip>
  </Flex>
);
