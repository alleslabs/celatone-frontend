import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PoolInfoTextProps {
  title: string;
  children: ReactNode;
}

export const PoolInfoText = ({ title, children }: PoolInfoTextProps) => (
  <Flex direction="column" gap={1} minW={0}>
    <Text variant="body2" textColor="gray.500" fontWeight={500}>
      {title}
    </Text>
    {typeof children === "string" ? (
      <Text variant="body2">{children}</Text>
    ) : (
      children
    )}
  </Flex>
);
