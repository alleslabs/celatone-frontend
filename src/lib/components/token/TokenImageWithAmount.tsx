import { Flex, Text } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/types";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

import { TokenImageRender } from "./TokenImageRender";

interface TokenImageWithAmountProps {
  hasTrailingZeros?: boolean;
  token: TokenWithValue;
}

export const TokenImageWithAmount = ({
  hasTrailingZeros,
  token,
}: TokenImageWithAmountProps) => (
  <Flex alignItems="center" gap={2}>
    <TokenImageRender logo={token.logo} />
    <Text variant="body2" overflowWrap="anywhere">
      {formatUTokenWithPrecision(
        token.amount,
        token.precision ?? 0,
        undefined,
        undefined,
        hasTrailingZeros
      )}{" "}
      {getTokenLabel(token.denom, token.symbol)}
    </Text>
  </Flex>
);
