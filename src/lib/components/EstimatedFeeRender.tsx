import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import { useAssetInfos } from "lib/services/assetService";
import { formatBalanceWithDenom } from "lib/utils";

export const EstimatedFeeRender = ({
  estimatedFee,
  loading,
}: {
  estimatedFee: StdFee | undefined;
  loading: boolean;
}) => {
  const { assetInfos, isLoading: isAssetInfoLoading } = useAssetInfos({
    withPrices: false,
  });

  if (isAssetInfoLoading) return <Spinner size="sm" mx={1} />;
  if (loading)
    return (
      <>
        <Spinner size="sm" mx={1} /> Estimating ...
      </>
    );

  const coin = estimatedFee?.amount.at(0);
  if (!coin) return <>--</>;

  const chainAssetInfo = assetInfos?.[coin.denom];
  return (
    <>
      {formatBalanceWithDenom({
        coin,
        precision: chainAssetInfo?.precision,
        symbol: chainAssetInfo?.symbol,
      })}
    </>
  );
};
