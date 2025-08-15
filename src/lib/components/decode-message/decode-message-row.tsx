import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";

interface DecodeMessageRowProps {
  children: ReactNode;
  title: ReactNode;
}

export const DecodeMessageRow = ({
  children,
  title,
}: DecodeMessageRowProps) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      fontSize="14px"
      gap={4}
      w="full"
    >
      {typeof title === "string" ? (
        <Text mb={{ base: 1, md: 0 }} variant="body2" whiteSpace="nowrap">
          {title}
        </Text>
      ) : (
        title
      )}
      {children}
    </Flex>
  );
};
