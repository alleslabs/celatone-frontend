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
  <Flex bgColor="gray.700" h={1} position="relative">
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
          bgColor="gray.700"
          borderRadius="4px"
          color="text.dark"
          cursor="default"
          h="fit-content"
          textAlign="center"
          variant="body3"
          w={12}
        >
          {">"}
          {label}
        </Text>
      </Tooltip>
    </div>
  </Flex>
);
