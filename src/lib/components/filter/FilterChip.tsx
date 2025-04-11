import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

interface FilterChipProps {
  chipComponent: ReactNode;
  onSelect: () => void;
}

export const FilterChip = ({ chipComponent, onSelect }: FilterChipProps) => (
  <Flex
    cursor="pointer"
    display="inline-block"
    w="max-content"
    onClick={onSelect}
  >
    {chipComponent}
  </Flex>
);
