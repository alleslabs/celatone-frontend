import { Flex, ListItem, Text } from "@chakra-ui/react";
import type { CSSProperties, ReactNode } from "react";

import { CustomIcon } from "../icon";

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  cursor: "pointer",
  margin: "4px 0px",
  padding: "8px",
};

interface FilterDropdownItemProps {
  filterDropdownComponent: ReactNode;
  isOptionSelected: boolean;
  onSelect: () => void;
}

export const FilterDropdownItem = ({
  filterDropdownComponent,
  isOptionSelected,
  onSelect,
}: FilterDropdownItemProps) => (
  <ListItem
    style={listItemProps}
    _hover={{ bg: "gray.800" }}
    onClick={onSelect}
    transition="all 0.25s ease-in-out"
  >
    <Flex alignItems="center" justifyContent="space-between">
      <Text lineHeight="1.2" wordBreak="break-all">
        {filterDropdownComponent}
      </Text>
      {isOptionSelected && <CustomIcon name="check" color="gray.600" />}
    </Flex>
  </ListItem>
);
