import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

interface DepositRatioProps {
  current: TokenWithValue;
  min: TokenWithValue;
  isDepositOrVoting: boolean;
  isCompact: boolean;
}

export const DepositRatio = ({
  current,
  isCompact,
  isDepositOrVoting,
  min,
}: DepositRatioProps) => (
  <Flex align="center" gap={1} minW="fit-content">
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
                : "var(--chakra-colors-primary-main)",
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
        alt={getTokenLabel(min.denom, min.symbol)}
        boxSize={4}
        logo={min.logo}
      />
    )}
  </Flex>
);
