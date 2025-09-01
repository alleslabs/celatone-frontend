import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { formatTokenWithValue } from "lib/utils";

import { TokenImageRender } from "./TokenImageRender";

interface TokenImageWithAmountProps {
  hasTrailingZeros?: boolean;
  token: TokenWithValue;
}

export const TokenImageWithAmount = ({
  hasTrailingZeros,
  token,
}: TokenImageWithAmountProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return (
    <Flex alignItems="center" gap={2}>
      <TokenImageRender logo={token.logo} />
      <Text overflowWrap="anywhere" variant="body2">
        {formatTokenWithValue({ hasTrailingZeros, isEvm: evm.enabled, token })}
      </Text>
    </Flex>
  );
};
