import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface DropdownChevronProps {
  bg?: FlexProps["bg"];
  height?: FlexProps["height"];
  isOpen: boolean;
  onClick: FlexProps["onClick"];
}

export const DropdownChevron = ({
  bg = "background.main",
  height = "full",
  isOpen,
  onClick,
}: DropdownChevronProps) => (
  <Flex
    borderWidth="1px 1px 1px 0"
    align="center"
    bg={bg}
    h={height}
    pl={1}
    pr={2}
    right={0}
    borderColor="gray.700"
    borderRadius="0 8px 8px 0"
    onClick={onClick}
    position="absolute"
  >
    <CustomIcon
      name="chevron-down"
      color="gray.600"
      transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
    />
  </Flex>
);
