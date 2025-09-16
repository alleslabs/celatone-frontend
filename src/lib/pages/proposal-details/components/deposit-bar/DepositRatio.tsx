import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

interface DepositRatioProps {
  current: TokenWithValue;
  isCompact: boolean;
  isDepositOrVoting: boolean;
  min: TokenWithValue;
}

export const DepositRatio = ({
  current,
  isCompact,
  isDepositOrVoting,
  min,
}: DepositRatioProps) => {
  return (
    <Flex align="center" gap={1} minW="fit-content">
      <Text variant={isCompact ? "body2" : "body1"}>
        <span style={{ fontWeight: 500 }}>
          {formatUTokenWithPrecision({
            amount: current.amount,
            decimalPoints: isCompact ? 2 : undefined,
            isSuffix: false,
            precision: current.precision ?? 0,
          })}
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
            {formatUTokenWithPrecision({
              amount: min.amount,
              decimalPoints: isCompact ? 2 : undefined,
              isSuffix: false,
              precision: min.precision ?? 0,
            })}
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
};
