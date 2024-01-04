import { Box, Spinner } from "@chakra-ui/react";

import type { BechAddr, Option, TokenWithValue } from "lib/types";

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
        <Spinner mt={2} alignSelf="center" size="xl" />
      </Box>
    );

  if (isViewMore)
    return <OverviewCard title={title} message={message} tokens={tokens} />;

  if (bondDenoms.length === 1)
    return (
      <SingleBondCard
        title={title}
        message={message}
        address={address}
        bondDenom={bondDenoms[0]}
        tokens={tokens}
      />
    );

  return (
    <MultiBondsCard
      title={title}
      message={message}
      address={address}
      tokens={tokens}
    />
  );
};
