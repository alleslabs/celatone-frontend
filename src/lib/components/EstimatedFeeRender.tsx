import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import type { Token, U } from "lib/types";
import { formatUToken, getTokenLabel } from "lib/utils";

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
  if (!estimatedFee) return <>--</>;

  const { amount } = estimatedFee;
  return (
    <>
      {formatUToken(amount?.[0].amount as U<Token>)}{" "}
      {getTokenLabel(amount?.[0].denom)}
    </>
  );
};
