import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

interface MobileCardTemplateProps {
  topContent: ReactNode;
  middleContent?: ReactNode;
  bottomContent?: ReactNode;
  onClick?: () => void;
}
export const MobileCardTemplate = ({
  topContent,
  middleContent,
  bottomContent,
  onClick,
}: MobileCardTemplateProps) => (
  <Flex
    background="gray.900"
    borderRadius="8px"
    cursor="pointer"
    direction="column"
    gap={3}
    minW={0}
    p={3}
    w="full"
    onClick={onClick}
  >
    <Flex align="center" justify="space-between">
      {topContent}
    </Flex>
    {middleContent && (
      <Flex
        borderColor="gray.700"
        borderTopWidth="1px"
        direction="column"
        pt={3}
      >
        {middleContent}
      </Flex>
    )}
    {bottomContent && (
      <Flex
        borderColor="gray.700"
        borderTopWidth="1px"
        direction="column"
        pt={3}
      >
        {bottomContent}
      </Flex>
    )}
  </Flex>
);
