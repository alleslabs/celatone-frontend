import { Box, Spinner } from "@chakra-ui/react";

import type { DenomInfo } from "lib/pages/account-details/types";
import type { Addr, Option, TokenWithValue } from "lib/types";

import { MultiBondsCard } from "./MultiBondsCard";
import { SingleBondCard } from "./SingleBondCard";
import { SingleBondMultiAssetsCard } from "./SingleBondMultiAssetsCard";

interface TotalCardProps {
  title: string;
  message: string;
  address: Addr;
  bondDenoms: DenomInfo[];
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
}

export const TotalCard = ({
  title,
  message,
  address,
  bondDenoms,
  tokens = {},
  isLoading,
}: TotalCardProps) => {
  if (isLoading)
    return (
      <Box minW="233px">
        <Spinner mt={2} alignSelf="center" size="xl" />
      </Box>
    );

  if (bondDenoms.length === 1) {
    const denoms = Object.keys(tokens);
    const bondDenom = bondDenoms[0].denom;
    if (
      denoms.length === 0 ||
      (denoms.length === 1 && denoms.includes(bondDenom))
    )
      return (
        <SingleBondCard
          title={title}
          message={message}
          token={tokens[bondDenom]}
        />
      );
    return (
      <SingleBondMultiAssetsCard
        title={title}
        message={message}
        address={address}
        tokens={tokens}
      />
    );
  }

  return (
    <MultiBondsCard
      title={title}
      message={message}
      address={address}
      tokens={tokens}
    />
  );
};
