import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface FilterChipProps {
  chipComponent: ReactNode;
  selectOption: () => void;
}

export const FilterChip = ({
  chipComponent,
  selectOption,
}: FilterChipProps) => (
  <Flex
    display="inline-block"
    onClick={selectOption}
    w="max-content"
    cursor="pointer"
  >
    {chipComponent}
  </Flex>
);
