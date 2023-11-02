import { Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { TokenImageRender } from "lib/components/token";
import type { Option, Token, U, USD } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface SingleBondCardBodySingleProps {
  denom: string;
  amount: U<Token<Big>>;
  symbol: Option<string>;
  logo: Option<string | string[]>;
  precision: Option<number>;
  value: Option<USD<Big>>;
}

export const SingleBondCardBodySingle = ({
  denom,
  amount,
  symbol,
  logo,
  precision,
  value,
}: SingleBondCardBodySingleProps) => (
  <>
    <Flex alignItems="center" gap={1}>
      <Heading variant="h6" as="h6">
        {formatUTokenWithPrecision(amount, precision ?? 0)}
      </Heading>
      <Text variant="body1" textColor="text.main">
        {getTokenLabel(denom, symbol)}
      </Text>
      <TokenImageRender logo={logo} boxSize={6} />
    </Flex>
    <Text variant="body2" textColor="text.dark">
      ({value ? formatPrice(value) : "-"})
    </Text>
  </>
);
