import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useBaseApiRoute } from "lib/app-provider";
import { getAssetInfos } from "lib/services/asset";
import type { AssetInfo, Option } from "lib/types";

export type AssetInfosOpt = Option<{ [key: string]: AssetInfo }>;

export const useAssetInfos = (): {
  assetInfos: AssetInfosOpt;
  isLoading: boolean;
} => {
  const { currentChainRecord } = useWallet();
  const baseApiRoute = useBaseApiRoute("assets");

  const { data: assets, isLoading } = useQuery(
    ["query", "assetInfos", baseApiRoute],
    async () => getAssetInfos(baseApiRoute),
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
