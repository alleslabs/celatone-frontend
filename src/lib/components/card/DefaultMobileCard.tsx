import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface CardProps {
  topContent: ReactNode;
  middleContent: ReactNode;
  bottomContent: ReactNode;
}
export const DefaultMobileCard = ({
  topContent,
  middleContent,
  bottomContent,
}: CardProps) => {
  return (
    <Flex
      borderRadius="8px"
      background="gray.900"
      p={3}
      direction="column"
      gap={3}
      w="full"
    >
      <Flex align="center" justify="space-between">
        {topContent}
      </Flex>
      <Flex
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.700"
        py={3}
        direction="column"
      >
        {middleContent}
      </Flex>
      <Flex>{bottomContent}</Flex>
    </Flex>
  );
};
