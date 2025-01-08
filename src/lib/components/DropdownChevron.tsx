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
    h={height}
    bg={bg}
    onClick={onClick}
    position="absolute"
    pr={2}
    pl={1}
    right={0}
    align="center"
    borderWidth="1px 1px 1px 0"
    borderColor="gray.700"
    borderRadius="0 8px 8px 0"
  >
    <CustomIcon
      name="chevron-down"
      color="gray.600"
      transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
    />
  </Flex>
);
