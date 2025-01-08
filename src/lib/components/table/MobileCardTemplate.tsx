import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
    borderRadius="8px"
    background="gray.900"
    p={3}
    cursor="pointer"
    direction="column"
    gap={3}
    w="full"
    minW={0}
    onClick={onClick}
  >
    <Flex align="center" justify="space-between">
      {topContent}
    </Flex>
    {middleContent && (
      <Flex
        borderTop="1px solid"
        borderColor="gray.700"
        pt={3}
        direction="column"
      >
        {middleContent}
      </Flex>
    )}
    {bottomContent && (
      <Flex
        borderTop="1px solid"
        borderColor="gray.700"
        pt={3}
        direction="column"
      >
        {bottomContent}
      </Flex>
    )}
  </Flex>
);
