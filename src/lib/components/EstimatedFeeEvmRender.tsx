import { Spinner } from "@chakra-ui/react";
import type Big from "big.js";

import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import type { Option } from "lib/types";
import { coinToTokenWithValue, formatTokenWithValue } from "lib/utils";

export const EstimatedFeeEvmRender = ({
  gasPrice,
  gasUsed,
  loading,
}: {
  gasPrice: Option<Big>;
  gasUsed: Option<Big>;
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
  if (!gasPrice || !gasUsed || !feeDenom) return <>--</>;

  const feeAmount = gasPrice.mul(gasUsed);
  const feeToken = coinToTokenWithValue(
    feeDenom,
    feeAmount.toFixed(),
    assetInfos
  );
  return <>{formatTokenWithValue(feeToken, undefined, false)}</>;
};
