import type { CSSProperties, ReactNode } from "react";

import { Flex, ListItem, Text } from "@chakra-ui/react";

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
  onSelect: () => void;
}

export const FilterDropdownItem = ({
  isOptionSelected,
  filterDropdownComponent,
  onSelect,
}: FilterDropdownItemProps) => (
  <ListItem
    style={listItemProps}
    _hover={{ bg: "gray.800" }}
    transition="all 0.25s ease-in-out"
    onClick={onSelect}
  >
    <Flex alignItems="center" justifyContent="space-between">
      <Text lineHeight="1.2" wordBreak="break-all">
        {filterDropdownComponent}
      </Text>
      {isOptionSelected && <CustomIcon color="gray.600" name="check" />}
    </Flex>
  </ListItem>
);
