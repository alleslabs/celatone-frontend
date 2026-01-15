import type Big from "big.js";
import type { Ratio } from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { divWithDefault } from "lib/utils";

interface ProgressBarProps {
  /**
   * The background color of the unfilled portion (default: "accent.bg")
   */
  backgroundColor?: string;
  /**
   * The background color of the filled portion (default: "accent.main")
   */
  barColor?: string;
  /**
   * Border radius (default: 4)
   */
  borderRadius?: number;
  /**
   * The height of the progress bar (default: "8px")
   */
  height?: string;
  /**
   * The maximum value (denominator)
   */
  max: Big;
  /**
   * The current value (numerator)
   */
  value: Big;
}

export const ProgressBar = ({
  backgroundColor = "primary.background",
  barColor = "primary.main",
  borderRadius = 6,
  height = "8px",
  max,
  value,
}: ProgressBarProps) => {
  const ratio = divWithDefault(value, max, 0).toNumber() as Ratio<number>;
  const percentage = `${(ratio * 100).toFixed(2)}%`;

  return (
    <Box h={height} w="full">
      <Flex
        align="center"
        bgColor={backgroundColor}
        borderRadius={borderRadius}
        h="full"
        overflow="hidden"
        w="full"
      >
        <Flex
          align="center"
          bgColor={barColor}
          h="full"
          justifyContent="end"
          w={percentage}
        />
      </Flex>
    </Box>
  );
};
