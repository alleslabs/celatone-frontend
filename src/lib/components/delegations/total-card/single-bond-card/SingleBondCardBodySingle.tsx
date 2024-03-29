import { Flex, Heading, Text } from "@chakra-ui/react";

import { TokenImageRender } from "lib/components/token";
import type { TokenWithValue } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface SingleBondCardBodySingleProps {
  token: TokenWithValue;
}

export const SingleBondCardBodySingle = ({
  token,
}: SingleBondCardBodySingleProps) => (
  <>
    <Flex alignItems="center" gap={1}>
      <Heading variant="h6" as="h6">
        {formatUTokenWithPrecision(token.amount, token.precision ?? 0)}
      </Heading>
      <Text variant="body1" textColor="text.main">
        {getTokenLabel(token.denom, token.symbol)}
      </Text>
      <TokenImageRender logo={token.logo} boxSize={6} />
    </Flex>
    <Text variant="body2" textColor="text.dark">
      ({token?.value ? formatPrice(token.value) : "-"})
    </Text>
  </>
);
