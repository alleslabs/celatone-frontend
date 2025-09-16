import type Big from "big.js";
import type { Option } from "lib/types";

import { Spinner } from "@chakra-ui/react";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
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
    return <Spinner mx={1} size="sm" />;
  if (loading)
    return (
      <>
        <Spinner mx={1} size="sm" /> Estimating ...
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
  return (
    <>
      {formatTokenWithValue({
        decimalPoints: undefined,
        token: feeToken,
      })}
    </>
  );
};
