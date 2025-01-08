import { Flex, Text } from "@chakra-ui/react";

import { Tooltip } from "lib/components/Tooltip";

interface ValidatorsPercentDividerProps {
  rank: number;
  label: string;
}

export const ValidatorsPercentDivider = ({
  rank,
  label,
}: ValidatorsPercentDividerProps) => (
  <Flex position="relative" h={1} bgColor="gray.700">
    <div style={{ position: "absolute", top: "-300%" }}>
      <Tooltip
        placement="right"
        label={
          <Text variant="body2">
            Cumulative voting power from 1-{rank} ranked validators is {">"}
            {label}
          </Text>
        }
      >
        <Text
          variant="body3"
          color="text.dark"
          textAlign="center"
          w={12}
          h="fit-content"
          borderRadius="4px"
          bgColor="gray.700"
          cursor="default"
        >
          {">"}
          {label}
        </Text>
      </Tooltip>
    </div>
  </Flex>
);
