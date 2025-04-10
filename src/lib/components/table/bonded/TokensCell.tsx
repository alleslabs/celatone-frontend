import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";

import { TokenCell } from "../TokenCell";

interface TokensCellProps {
  tokens: TokenWithValue[];
  isSingleBondDenom: boolean;
  isUnbonding?: boolean;
}

const EmptyTokenCell = () => (
  <Text h="full" textColor="text.dark" variant="body2">
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
      bgColor={isUnbonding ? undefined : "gray.800"}
      borderRadius="8px"
      direction="column"
      gap={2}
      p={3}
      py={isUnbonding ? 0 : undefined}
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
