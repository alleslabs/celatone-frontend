import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { getAssetInfos } from "lib/services/asset";
import type { AssetInfo, Option } from "lib/types";

export const useAssetInfos = (): {
  assetInfos: Option<{ [key: string]: AssetInfo }>;
  isLoading: boolean;
} => {
  const { currentChainRecord } = useWallet();

  const { data: assets, isLoading } = useQuery(
    [
      "query",
      "assetInfos",
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    async () =>
      getAssetInfos(
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id
      ),
    { enabled: !!currentChainRecord }
  );

  return {
    assetInfos: assets?.reduce(
      (acc, asset) => ({ ...acc, [asset.id]: asset }),
      {}
    ),
    isLoading,
  };
};

export type AssetInfosReturn = ReturnType<typeof useAssetInfos>["assetInfos"];
