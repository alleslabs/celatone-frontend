import { Flex, ListItem } from "@chakra-ui/react";
import type { CSSProperties, ReactNode } from "react";

import { CustomIcon } from "../icon";

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  margin: "4px 0px",
  padding: "8px",
  cursor: "pointer",
};

interface FilterDropdownItemProps {
  isOptionSelected: boolean;
  filterDropdownComponent: ReactNode;
  selectOption: () => void;
}

export const FilterDropdownItem = ({
  isOptionSelected,
  filterDropdownComponent,
  selectOption,
}: FilterDropdownItemProps) => (
  <ListItem
    style={listItemProps}
    _hover={{ bg: "pebble.800" }}
    transition="all .25s ease-in-out"
    onClick={selectOption}
  >
    <Flex alignItems="center" justifyContent="space-between">
      {filterDropdownComponent}
      {isOptionSelected && <CustomIcon name="check" />}
    </Flex>
  </ListItem>
);
