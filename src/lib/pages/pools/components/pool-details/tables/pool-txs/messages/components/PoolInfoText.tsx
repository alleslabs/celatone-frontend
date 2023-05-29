import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PoolInfoTextProps {
  title: string;
  isText?: boolean;
  text?: string;
  component?: ReactNode;
}

export const PoolInfoText = ({
  title,
  isText = false,
  text,
  component,
}: PoolInfoTextProps) => (
  <Flex direction="column" gap={1} minW="90px">
    <Text variant="body2" textColor="pebble.500" fontWeight={500}>
      {title}
    </Text>
    {isText ? (
      <Text variant="body2" fontWeight={400}>
        {text}
      </Text>
    ) : (
      component
    )}
  </Flex>
);
