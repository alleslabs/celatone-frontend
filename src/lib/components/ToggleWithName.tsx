import { Button, Flex } from "@chakra-ui/react";

import type { LVPair } from "lib/types";

interface ToggleWithNameProps {
  selectedValue: string;
  options: LVPair[];
  selectOption: (value: string) => void;
}

export const ToggleWithName = ({
  selectedValue,
  options,
  selectOption,
}: ToggleWithNameProps) => (
  <Flex p={1} borderRadius={4} border="1px" borderColor="gray.700">
    {options.map((item) => (
      <Button
        key={item.value}
        borderRadius={4}
        size="sm"
        height="22px"
        width="64px"
        variant={item.value === selectedValue ? "primary" : "ghost-primary"}
        onClick={() => selectOption(item.value)}
      >
        {item.label}
      </Button>
    ))}
  </Flex>
);
