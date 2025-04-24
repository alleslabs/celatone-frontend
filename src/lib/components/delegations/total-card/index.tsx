import type { BechAddr, Option, TokenWithValue } from "lib/types";

import { Box, Spinner } from "@chakra-ui/react";

import { MultiBondsCard } from "./MultiBondsCard";
import { OverviewCard } from "./OverviewCard";
import { SingleBondCard } from "./single-bond-card";

export interface TotalCardProps {
  address: BechAddr;
  bondDenoms: TokenWithValue[];
  isLoading: boolean;
  isViewMore: boolean;
  message: string;
  title: string;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const TotalCard = ({
  address,
  bondDenoms,
  isLoading,
  isViewMore,
  message,
  title,
  tokens,
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
