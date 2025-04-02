import type { TokenWithValue } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { TokenComposition, TokenImageRender } from "lib/components/token";

interface TokenCellProps {
  token: TokenWithValue;
}

export const TokenCell = ({ token }: TokenCellProps) => (
  <Flex alignItems="center" gap={2}>
    <TokenImageRender logo={token.logo} />
    <TokenComposition token={token} />
  </Flex>
);
