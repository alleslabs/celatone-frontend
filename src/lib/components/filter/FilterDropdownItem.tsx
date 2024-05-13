import { Flex, ListItem, Text } from "@chakra-ui/react";
import type { CSSProperties, ReactNode } from "react";

import { CustomIcon } from "../icon";
import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { toggleItem } from "lib/utils";

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  margin: "4px 0px",
  padding: "8px",
  cursor: "pointer",
};

interface FilterDropdownItemProps {
  result: string[];
  isMulti: boolean;
  option: string;
  filterDropdownComponent: ReactNode;
  setIsDropdown: (isDropdown: boolean) => void;
  setKeyword: (keyword: string) => void;
  setResult: (option: string[]) => void;
}

export const FilterDropdownItem = ({
  result,
  isMulti,
  option,
  filterDropdownComponent,
  setIsDropdown,
  setKeyword,
  setResult,
}: FilterDropdownItemProps) => {
  const isOptionSelected =
    typeof result === "string" ? result === option : result?.includes(option);

  const selectOption = () => {
    setKeyword("");

    if (!isMulti) {
      setIsDropdown(false);

      if (result[0] === option) {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "remove");

        setResult([]);

        return;
      }

      trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "add");

      setResult([option]);

      return;
    }

    if (result.includes(option)) {
      trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "remove");
    } else {
      trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "add");
    }

    setResult(toggleItem(result, option));
  };

  return (
    <ListItem
      style={listItemProps}
      _hover={{ bg: "gray.800" }}
      transition="all 0.25s ease-in-out"
      onClick={selectOption}
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
