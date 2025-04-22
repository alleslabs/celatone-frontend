import type { LVPair } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";

interface ToggleWithNameProps {
  options: LVPair[];
  selectedValue: string;
  selectOption: (value: string) => void;
}

export const ToggleWithName = ({
  options,
  selectedValue,
  selectOption,
}: ToggleWithNameProps) => (
  <Flex border="1px" borderColor="gray.700" borderRadius={4} p={1}>
    {options.map((item) => (
      <Button
        key={item.value}
        borderRadius={4}
        height="22px"
        size="sm"
        variant={item.value === selectedValue ? "primary" : "ghost-primary"}
        width="64px"
        onClick={() => selectOption(item.value)}
      >
        {item.label}
      </Button>
    ))}
  </Flex>
);
