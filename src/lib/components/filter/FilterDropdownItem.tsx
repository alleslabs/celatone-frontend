import { Flex, ListItem, Text } from "@chakra-ui/react";
import type { CSSProperties, ReactNode } from "react";

import { CustomIcon } from "../icon";

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  margin: "4px 0px",
  padding: "8px",
  cursor: "pointer",
};

interface FilterDropdownItemProps {
  result: string | string[] | undefined;
  option: string;
  filterDropdownComponent: ReactNode;
  onSelect: () => void;
}

export const FilterDropdownItem = ({
  result,
  option,
  filterDropdownComponent,
  onSelect,
}: FilterDropdownItemProps) => {
  const isOptionSelected =
    typeof result === "string" ? result === option : result?.includes(option);

  return (
    <ListItem
      style={listItemProps}
      _hover={{ bg: "gray.800" }}
      transition="all 0.25s ease-in-out"
      onClick={onSelect}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text wordBreak="break-all" lineHeight="1.2">
          {filterDropdownComponent}
        </Text>
        {isOptionSelected && <CustomIcon name="check" color="gray.600" />}
      </Flex>
    </ListItem>
  );
};
