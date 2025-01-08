import { Flex, Text } from "@chakra-ui/react";

import { TokenCell } from "../TokenCell";
import type { TokenWithValue } from "lib/types";

interface TokensCellProps {
  isSingleBondDenom: boolean;
  isUnbonding?: boolean;
  tokens: TokenWithValue[];
}

const EmptyTokenCell = () => (
  <Text h="full" variant="body2" textColor="text.dark">
    -
  </Text>
);

export const TokensCell = ({
  isSingleBondDenom,
  isUnbonding,
  tokens,
}: TokensCellProps) => {
  if (isSingleBondDenom)
    return !tokens.length ? (
      <EmptyTokenCell />
    ) : (
      <TokenCell token={tokens[0]} />
    );

  return (
    <Flex
      gap={2}
      p={3}
      py={isUnbonding ? 0 : undefined}
      w="full"
      bgColor={isUnbonding ? undefined : "gray.800"}
      borderRadius="8px"
      direction="column"
    >
      {!tokens.length ? (
        <EmptyTokenCell />
      ) : (
        tokens.map((token) => <TokenCell key={token.denom} token={token} />)
      )}
    </Flex>
  );
};
