import type { TokenWithValue } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";
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
      <Heading as="h6" variant="h6">
        {formatUTokenWithPrecision(token.amount, token.precision ?? 0)}
      </Heading>
      <Text textColor="text.main" variant="body1">
        {getTokenLabel(token.denom, token.symbol)}
      </Text>
      <TokenImageRender boxSize={6} logo={token.logo} />
    </Flex>
    <Text textColor="text.dark" variant="body2">
      ({token?.value ? formatPrice(token.value) : "-"})
    </Text>
  </>
);
