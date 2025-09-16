import type { FlexProps } from "@chakra-ui/react";
import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface TokenCompositionProps extends FlexProps {
  token: TokenWithValue;
}

export const TokenComposition = ({
  token,
  ...flexProps
}: TokenCompositionProps) => {
  return (
    <Flex direction="column" {...flexProps}>
      {token.isLPToken ? (
        <Flex wrap="wrap">
          <Text variant="body2">
            <Text as="span" fontWeight={700} mr={1}>
              {formatUTokenWithPrecision({
                amount: token.poolInfo.coinA.amount,
                precision: token.poolInfo.coinA.precision ?? 0,
              })}
            </Text>
            {getTokenLabel(
              token.poolInfo.coinA.denom,
              token.poolInfo.coinA.symbol
            )}
          </Text>
          <Text mx={1} variant="body2">
            +
          </Text>
          <Text variant="body2">
            <Text as="span" fontWeight={700} mr={1}>
              {formatUTokenWithPrecision({
                amount: token.poolInfo.coinB.amount,
                precision: token.poolInfo.coinB.precision ?? 0,
              })}
            </Text>
            {getTokenLabel(
              token.poolInfo.coinB.denom,
              token.poolInfo.coinB.symbol
            )}
          </Text>
        </Flex>
      ) : (
        <Text variant="body2">
          <Text as="span" fontWeight={700} mr={1}>
            {formatUTokenWithPrecision({
              amount: token.amount,
              precision: token.precision ?? 0,
            })}
          </Text>
          {getTokenLabel(token.denom, token.symbol)}
        </Text>
      )}
      <Text textColor="text.dark" variant="body3">
        {token.value ? `(≈ ${formatPrice(token.value)})` : "-"}
      </Text>
    </Flex>
  );
};
