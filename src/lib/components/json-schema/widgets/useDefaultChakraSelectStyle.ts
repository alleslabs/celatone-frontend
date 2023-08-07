import { useColorModeValue } from "@chakra-ui/react";
import type { Props as SelectProps } from "chakra-react-select";
import type { GroupBase } from "react-select/dist/declarations/src/types";

/**
 * Hook to return the default chakra select styling.
 * @todo border in dark mode!
 */
export function useDefaultChakraSelectStyle<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  ...customStyles
}: Partial<SelectProps<Option, IsMulti, Group>["chakraStyles"]> = {}): Partial<
  SelectProps<Option, IsMulti, Group>
> {
  const menuListBg = useColorModeValue(undefined, "navy.700");

  const chakraStyles: SelectProps<Option, IsMulti, Group>["chakraStyles"] = {
    control: (provided) => ({
      ...provided,
      bg: menuListBg || provided.bg,
    }),
    menuList: (provided) => ({
      ...provided,
      bg: menuListBg || provided.bg,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      bg: "transparent",
      px: 2,
      cursor: "inherit",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    ...customStyles,
  };
  return { chakraStyles };
}
