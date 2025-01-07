import { Box, Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { Ratio } from "lib/types";
import { divWithDefault, formatPrettyPercent } from "lib/utils";

interface ProgressBarProps {
  isCompact: boolean;
  max: Big;
  value: Big;
}

export const ProgressBar = ({ isCompact, max, value }: ProgressBarProps) => {
  const ratio = divWithDefault(value, max, 0).toNumber() as Ratio<number>;
  const percent = formatPrettyPercent(ratio);

  return (
    <Box h={isCompact ? "28px" : "30px"} py={1} w="full">
      <Flex
        align="center"
        h="full"
        w="full"
        bgColor="gray.700"
        borderRadius={10}
        overflow="hidden"
      >
        <Flex
          align="center"
          h="full"
          w={percent}
          bgColor="primary.main"
          justifyContent="end"
        >
          {!isCompact && ratio >= 0.5 && (
            <Text mr={1} variant="body2" color="gray.900" fontWeight={500}>
              {percent}
            </Text>
          )}
        </Flex>
        {!isCompact && ratio < 0.5 && (
          <Text ml={1} variant="body2" color="gray.900" fontWeight={500}>
            {percent}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
