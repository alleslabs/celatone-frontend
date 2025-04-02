import type { BechAddr, Option, TokenWithValue } from "lib/types";

import { Box, Spinner } from "@chakra-ui/react";

import { MultiBondsCard } from "./MultiBondsCard";
import { OverviewCard } from "./OverviewCard";
import { SingleBondCard } from "./single-bond-card";

export interface TotalCardProps {
  title: string;
  message: string;
  address: BechAddr;
  bondDenoms: TokenWithValue[];
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
  isViewMore: boolean;
}

export const TotalCard = ({
  title,
  message,
  address,
  bondDenoms,
  tokens,
  isLoading,
  isViewMore,
}: TotalCardProps) => {
  if (isLoading)
    return (
      <Box minW={48}>
        <Spinner alignSelf="center" mt={2} size="xl" />
      </Box>
    );

  if (isViewMore)
    return <OverviewCard message={message} title={title} tokens={tokens} />;

  if (bondDenoms.length === 1)
    return (
      <SingleBondCard
        address={address}
        bondDenom={bondDenoms[0]}
        message={message}
        title={title}
        tokens={tokens}
      />
    );

  return (
    <MultiBondsCard
      address={address}
      message={message}
      title={title}
      tokens={tokens}
    />
  );
};
