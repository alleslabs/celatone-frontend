import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";

interface PoolInfoTextProps {
  title: string;
  children: ReactNode;
}

export const PoolInfoText = ({ title, children }: PoolInfoTextProps) => (
  <Flex direction="column" gap={1} minW={0}>
    <Text fontWeight={500} textColor="gray.500" variant="body2">
      {title}
    </Text>
    {typeof children === "string" ? (
      <Text variant="body2">{children}</Text>
    ) : (
      children
    )}
  </Flex>
);
