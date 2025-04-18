import type Big from "big.js";
import type { Ratio } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { divWithDefault, formatPrettyPercent } from "lib/utils";

interface ProgressBarProps {
  value: Big;
  max: Big;
  isCompact: boolean;
}

export const ProgressBar = ({ isCompact, max, value }: ProgressBarProps) => {
  const ratio = divWithDefault(value, max, 0).toNumber() as Ratio<number>;
  const percent = formatPrettyPercent(ratio);

  return (
    <Box h={isCompact ? "28px" : "30px"} py={1} w="full">
      <Flex
        align="center"
        bgColor="gray.700"
        borderRadius={10}
        h="full"
        overflow="hidden"
        w="full"
      >
        <Flex
          align="center"
          bgColor="primary.main"
          h="full"
          justifyContent="end"
          w={percent}
        >
          {!isCompact && ratio >= 0.5 && (
            <Text color="gray.900" fontWeight={500} mr={1} variant="body2">
              {percent}
            </Text>
          )}
        </Flex>
        {!isCompact && ratio < 0.5 && (
          <Text color="gray.900" fontWeight={500} ml={1} variant="body2">
            {percent}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
