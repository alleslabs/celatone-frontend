import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import { useChainRecordAsset } from "lib/app-provider";
import { formatBalanceWithDenom } from "lib/utils";

export const EstimatedFeeRender = ({
  estimatedFee,
  loading,
}: {
  estimatedFee: StdFee | undefined;
  loading: boolean;
}) => {
  const getAssetInfo = useChainRecordAsset();
  if (loading) {
    return (
      <>
        <Spinner size="sm" mx={1} /> Estimating ...
      </>
    );
  }
  const coin = estimatedFee?.amount.at(0);

  if (!coin) return <>--</>;

  const chainAssetInfo = getAssetInfo(coin.denom);
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
