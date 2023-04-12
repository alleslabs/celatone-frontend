import { Flex, Image, Text } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import type { TokenWithValue } from "lib/pages/account-details/type";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface TokenCellProps {
  token: TokenWithValue;
}

export const TokenCell = ({ token }: TokenCellProps) => (
  <Flex alignItems="center" gap={1}>
    <Image
      boxSize={6}
      src={token.logo}
      alt={getTokenLabel(token.denom)}
      fallback={<NAToken />}
      fallbackStrategy="onError"
    />
    <Flex direction="column">
      <Flex gap={1} alignItems="center">
        <Text variant="body2" fontWeight="700">
          {formatUTokenWithPrecision(token.amount, token.precision || 0)}
        </Text>
        <Text variant="body2">{getTokenLabel(token.denom)}</Text>
      </Flex>
      <Text variant="body3" textColor="text.dark">
        ({token.value ? formatPrice(token.value) : "-"})
      </Text>
    </Flex>
  </Flex>
);
