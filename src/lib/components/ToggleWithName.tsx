import { Button, Flex } from "@chakra-ui/react";

import type { LVPair } from "lib/types";

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
  <Flex p={1} border="1px" borderColor="gray.700" borderRadius={4}>
    {options.map((item) => (
      <Button
        key={item.value}
        width="64px"
        height="22px"
        size="sm"
        variant={item.value === selectedValue ? "primary" : "ghost-primary"}
        borderRadius={4}
        onClick={() => selectOption(item.value)}
      >
        {item.label}
      </Button>
    ))}
  </Flex>
);
