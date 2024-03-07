import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { DotSeparator } from "lib/components/DotSeparator";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { ContractState } from "lib/types";

interface StateCardProps {
  state: ContractState;
}

export const StateCard = ({ state }: StateCardProps) => {
  const [firstKey, remainingKeys] = useMemo(() => {
    if (state.key.type === "singleton") return [state.key.value, []];

    return [state.key.values[0], state.key.values.slice(1)];
  }, [state.key]);

  return (
    <Box borderRadius={8} bgColor="gray.900" p={3} maxWidth="100%">
      <Box mb={3}>
        <Text variant="body2" color="text.main" wordBreak="break-word">
          {firstKey}
        </Text>
        {remainingKeys.map((each) => (
          <Flex key={each} gap={2}>
            <DotSeparator mt={2} />
            <Text variant="body2" color="text.main" wordBreak="break-word">
              {each}
            </Text>
          </Flex>
        ))}
      </Box>
      <JsonReadOnly
        text={JSON.stringify(state.value, null, 2)}
        canCopy
        fullWidth
        isExpandable
      />
    </Box>
  );
};
