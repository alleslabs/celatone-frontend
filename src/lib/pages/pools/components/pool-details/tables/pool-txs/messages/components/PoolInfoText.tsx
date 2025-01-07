import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PoolInfoTextProps {
  children: ReactNode;
  title: string;
}

export const PoolInfoText = ({ children, title }: PoolInfoTextProps) => (
  <Flex gap={1} minW={0} direction="column">
    <Text variant="body2" fontWeight={500} textColor="gray.500">
      {title}
    </Text>
    {typeof children === "string" ? (
      <Text variant="body2">{children}</Text>
    ) : (
      children
    )}
  </Flex>
);
