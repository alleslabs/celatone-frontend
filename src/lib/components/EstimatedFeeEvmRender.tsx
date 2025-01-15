import { Spinner } from "@chakra-ui/react";
import Big from "big.js";

import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import { coinToTokenWithValue, formatTokenWithValue } from "lib/utils";

export const EstimatedFeeEvmRender = ({
  gasPrice,
  gasUsed,
  loading,
}: {
  gasPrice: Big;
  gasUsed: Big;
  loading: boolean;
}) => {
  const { data: assetInfos, isLoading: isAssetInfoLoading } = useAssetInfos({
    withPrices: false,
  });
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();

  if (isAssetInfoLoading || isEvmParamsLoading)
    return <Spinner size="sm" mx={1} />;
  if (loading)
    return (
      <>
        <Spinner size="sm" mx={1} /> Estimating ...
      </>
    );

  const feeDenom = evmParams?.params.feeDenom;
  if (!feeDenom) return <>--</>;

  const feeAmount = gasPrice.mul(gasUsed);
  const feeToken = coinToTokenWithValue(
    feeDenom,
    feeAmount.toFixed(),
    assetInfos
  );
  return <>{formatTokenWithValue(feeToken, undefined, false)}</>;
};
