import { Box, Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { Ratio } from "lib/types";
import { divWithDefault, formatPrettyPercent } from "lib/utils";

interface ProgressBarProps {
  value: Big;
  max: Big;
  isCompact: boolean;
}

export const ProgressBar = ({ value, max, isCompact }: ProgressBarProps) => {
  const ratio = divWithDefault(value, max, 0).toNumber() as Ratio<number>;
  const percent = formatPrettyPercent(ratio);

  return (
    <Box py={1} h={isCompact ? "28px" : "30px"} w="full">
      <Flex
        h="full"
        w="full"
        bgColor="gray.700"
        borderRadius={10}
        align="center"
        overflow="hidden"
      >
        <Flex
          h="full"
          bgColor="primary.main"
          w={percent}
          align="center"
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
