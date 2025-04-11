import type { FlexProps } from "@chakra-ui/react";

import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface DropdownChevronProps {
  isOpen: boolean;
  onClick: FlexProps["onClick"];
  height?: FlexProps["height"];
  bg?: FlexProps["bg"];
}

export const DropdownChevron = ({
  isOpen,
  height = "full",
  bg = "background.main",
  onClick,
}: DropdownChevronProps) => (
  <Flex
    align="center"
    bg={bg}
    borderColor="gray.700"
    borderRadius="0 8px 8px 0"
    borderWidth="1px 1px 1px 0"
    h={height}
    pl={1}
    position="absolute"
    pr={2}
    right={0}
    onClick={onClick}
  >
    <CustomIcon
      color="gray.600"
      name="chevron-down"
      transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
    />
  </Flex>
);
