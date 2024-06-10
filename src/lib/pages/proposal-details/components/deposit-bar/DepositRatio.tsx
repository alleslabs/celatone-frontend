import { Flex, Text } from "@chakra-ui/react";

import { TokenImageRender } from "lib/components/token";
import type { TokenWithValue } from "lib/types";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

interface DepositRatioProps {
  current: TokenWithValue;
  min: TokenWithValue;
  isDepositOrVoting: boolean;
  isCompact: boolean;
}

export const DepositRatio = ({
  current,
  min,
  isDepositOrVoting,
  isCompact,
}: DepositRatioProps) => (
  <Flex gap={1} align="center" minW="fit-content">
    <Text variant={isCompact ? "body2" : "body1"}>
      <span style={{ fontWeight: 500 }}>
        {formatUTokenWithPrecision(
          current.amount,
          current.precision ?? 0,
          false,
          isCompact ? 2 : undefined
        )}
      </span>
      {isDepositOrVoting && (
        <>
          <span
            style={{
              color: isCompact
                ? "var(--chakra-colors-text-main)"
                : "var(--chakra-colors-accent-main)",
            }}
          >
            {" / "}
          </span>
          {formatUTokenWithPrecision(
            min.amount,
            min.precision ?? 0,
            false,
            isCompact ? 2 : undefined
          )}
        </>
      )}
      {` ${getTokenLabel(min.denom, min.symbol)}`}
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
