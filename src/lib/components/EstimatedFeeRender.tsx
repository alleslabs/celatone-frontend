import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue, formatTokenWithValue } from "lib/utils";

export const EstimatedFeeRender = ({
  estimatedFee,
  loading,
}: {
  estimatedFee: StdFee | undefined;
  loading: boolean;
}) => {
  const { data: assetInfos, isLoading: isAssetInfoLoading } = useAssetInfos({
    withPrices: false,
  });

  if (isAssetInfoLoading) return <Spinner mx={1} size="sm" />;
  if (loading)
    return (
      <>
        <Spinner mx={1} size="sm" /> Estimating ...
      </>
    );

  const fee = estimatedFee?.amount[0];
  if (!fee) return <>--</>;

  const feeToken = coinToTokenWithValue(fee.denom, fee.amount, assetInfos);
  return <>{formatTokenWithValue(feeToken)}</>;
};
