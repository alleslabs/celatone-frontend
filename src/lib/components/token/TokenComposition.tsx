import { Flex, type FlexProps, Text } from "@chakra-ui/react";

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
    {token.isLpToken ? (
      <Flex>
        <Text variant="body2">
          <Text as="span" mr={1} fontWeight={700}>
            {token.lpDetails.coinA.amount}
          </Text>
          {getTokenLabel(
            token.lpDetails.coinA.denom,
            token.lpDetails.coinA.symbol
          )}
        </Text>
        <Text variant="body2" mx={1}>
          +
        </Text>
        <Text variant="body2">
          <Text as="span" mr={1} fontWeight={700}>
            {token.lpDetails.coinB.amount}
          </Text>
          {getTokenLabel(
            token.lpDetails.coinB.denom,
            token.lpDetails.coinB.symbol
          )}
        </Text>
      </Flex>
    ) : (
      <Text variant="body2">
        <Text as="span" fontWeight={700} mr={1}>
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
