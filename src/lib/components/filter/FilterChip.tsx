import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface FilterChipProps {
  chipComponent: ReactNode;
  onSelect: () => void;
}

export const FilterChip = ({ chipComponent, onSelect }: FilterChipProps) => (
  <Flex
    display="inline-block"
    w="max-content"
    cursor="pointer"
    onClick={onSelect}
  >
    {chipComponent}
  </Flex>
);
