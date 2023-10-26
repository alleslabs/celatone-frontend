import { Flex } from "@chakra-ui/react";

import { TokenImageRender, TokenComposition } from "lib/components/token";
import type { TokenWithValue } from "lib/types";

interface TokenCellProps {
  token: TokenWithValue;
}

export const TokenCell = ({ token }: TokenCellProps) => (
  <Flex alignItems="center" gap={2}>
    <TokenImageRender logo={token.logo} />
    <TokenComposition token={token} />
  </Flex>
);
