import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";

interface PoolInfoTextProps {
  children: ReactNode;
  title: string;
}

export const PoolInfoText = ({ children, title }: PoolInfoTextProps) => (
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
