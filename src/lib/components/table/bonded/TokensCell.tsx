import { Flex, Text } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/types";
import { TokenCell } from "../TokenCell";

interface TokensCellProps {
  tokens: TokenWithValue[];
  isSingleBondDenom: boolean;
  isUnbonding?: boolean;
}

const EmptyTokenCell = () => (
  <Text variant="body2" textColor="text.dark" h="full">
    -
  </Text>
);

export const TokensCell = ({
  tokens,
  isSingleBondDenom,
  isUnbonding,
}: TokensCellProps) => {
  if (isSingleBondDenom)
    return !tokens.length ? (
      <EmptyTokenCell />
    ) : (
      <TokenCell token={tokens[0]} />
    );

  return (
    <Flex
      direction="column"
      p={3}
      bgColor={isUnbonding ? undefined : "gray.800"}
      py={isUnbonding ? 0 : undefined}
      borderRadius="8px"
      gap={2}
      w="full"
    >
      {!tokens.length ? (
        <EmptyTokenCell />
      ) : (
        tokens.map((token) => <TokenCell key={token.denom} token={token} />)
      )}
    </Flex>
  );
};
