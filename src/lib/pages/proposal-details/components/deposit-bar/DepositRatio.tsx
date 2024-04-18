import { Flex, Text } from "@chakra-ui/react";

import { TokenImageRender } from "lib/components/token";
import type { TokenWithValue } from "lib/types";
import {
  formatTokenWithValue,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface DepositRatioProps {
  current: TokenWithValue;
  min: TokenWithValue;
  isCompact: boolean;
}

export const DepositRatio = ({
  current,
  min,
  isCompact,
}: DepositRatioProps) => (
  <Flex gap={1} align="center" minW="fit-content">
    <Text variant={isCompact ? "body2" : "body1"} alignContent="center">
      <span style={{ fontWeight: 500 }}>
        {formatUTokenWithPrecision(
          current.amount,
          current.precision ?? 0,
          false,
          isCompact ? 2 : undefined
        )}
      </span>
      <span
        style={{
          color: isCompact
            ? "var(--chakra-colors-text-main)"
            : "var(--chakra-colors-accent-main)",
        }}
      >
        {" / "}
      </span>
      {formatTokenWithValue(min, isCompact ? 2 : undefined)}
    </Text>
    {!isCompact && (
      <TokenImageRender
        logo={min.logo}
        alt={getTokenLabel(min.denom, min.symbol)}
        boxSize={4}
      />
    )}
  </Flex>
);
