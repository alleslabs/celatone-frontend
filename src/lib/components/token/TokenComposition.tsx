import { Flex, Text } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/types";
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
}: TokenCompositionProps) => (
  <Flex direction="column" {...flexProps}>
    {token.isLPToken ? (
      <Flex wrap="wrap">
        <Text variant="body2">
          <Text as="span" mr={1} fontWeight={700}>
            {formatUTokenWithPrecision(
              token.poolInfo.coinA.amount,
              token.poolInfo.coinA.precision ?? 0
            )}
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
          <Text as="span" mr={1} fontWeight={700}>
            {formatUTokenWithPrecision(
              token.poolInfo.coinB.amount,
              token.poolInfo.coinB.precision ?? 0
            )}
          </Text>
          {getTokenLabel(
            token.poolInfo.coinB.denom,
            token.poolInfo.coinB.symbol
          )}
        </Text>
      </Flex>
    ) : (
      <Text variant="body2">
        <Text as="span" mr={1} fontWeight={700}>
          {formatUTokenWithPrecision(token.amount, token.precision ?? 0)}
        </Text>
        {getTokenLabel(token.denom, token.symbol)}
      </Text>
    )}
    <Text variant="body3" textColor="text.dark">
      {token.value ? `(≈ ${formatPrice(token.value)})` : "-"}
    </Text>
  </Flex>
);
