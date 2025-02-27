import { Flex, Text } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/types";
import { formatTokenWithValue } from "lib/utils";

import { TokenImageRender } from "./TokenImageRender";

interface TokenImageWithAmountProps {
  token: TokenWithValue;
  hasTrailingZeros?: boolean;
}

export const TokenImageWithAmount = ({
  token,
  hasTrailingZeros,
}: TokenImageWithAmountProps) => (
  <Flex alignItems="center" gap={2}>
    <TokenImageRender logo={token.logo} />
    <Text variant="body2" overflowWrap="anywhere">
      {formatTokenWithValue(token, undefined, hasTrailingZeros)}
    </Text>
  </Flex>
);
