import { Flex, Text } from "@chakra-ui/react";

import { Tooltip } from "lib/components/Tooltip";

interface ValidatorsPercentDividerProps {
  label: string;
  rank: number;
}

export const ValidatorsPercentDivider = ({
  label,
  rank,
}: ValidatorsPercentDividerProps) => (
  <Flex h={1} bgColor="gray.700" position="relative">
    <div style={{ position: "absolute", top: "-300%" }}>
      <Tooltip
        label={
          <Text variant="body2">
            Cumulative voting power from 1-{rank} ranked validators is {">"}
            {label}
          </Text>
        }
        placement="right"
      >
        <Text
          h="fit-content"
          textAlign="center"
          variant="body3"
          w={12}
          bgColor="gray.700"
          borderRadius="4px"
          color="text.dark"
          cursor="default"
        >
          {">"}
          {label}
        </Text>
      </Tooltip>
    </div>
  </Flex>
);
