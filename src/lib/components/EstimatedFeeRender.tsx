import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";
import { formatToken, getTokenLabel } from "lib/utils";

export const EstimatedFeeRender = ({
  estimatedFee,
  loading,
}: {
  estimatedFee: StdFee | undefined;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <>
        <Spinner color="gray.400" size="sm" mx={1} /> Estimating ...
      </>
    );
  }
  const coin = estimatedFee?.amount.at(0);

  if (!coin) return <>--</>;

  return (
    <>
      {formatToken(coin.amount as U<Token>, coin.denom)}{" "}
      {getTokenLabel(coin.denom)}
    </>
  );
};
