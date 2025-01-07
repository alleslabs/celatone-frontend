import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface MobileCardTemplateProps {
  bottomContent?: ReactNode;
  middleContent?: ReactNode;
  onClick?: () => void;
  topContent: ReactNode;
}
export const MobileCardTemplate = ({
  bottomContent,
  middleContent,
  onClick,
  topContent,
}: MobileCardTemplateProps) => (
  <Flex
    gap={3}
    minW={0}
    p={3}
    w="full"
    background="gray.900"
    borderRadius="8px"
    cursor="pointer"
    direction="column"
    onClick={onClick}
  >
    <Flex align="center" justify="space-between">
      {topContent}
    </Flex>
    {middleContent && (
      <Flex
        pt={3}
        borderColor="gray.700"
        borderTop="1px solid"
        direction="column"
      >
        {middleContent}
      </Flex>
    )}
    {bottomContent && (
      <Flex
        pt={3}
        borderColor="gray.700"
        borderTop="1px solid"
        direction="column"
      >
        {bottomContent}
      </Flex>
    )}
  </Flex>
);
