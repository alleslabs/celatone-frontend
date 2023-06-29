import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useBaseApiRoute } from "lib/app-provider";
import { getAssetInfos } from "lib/services/asset";
import type { AssetInfo, Option } from "lib/types";

export type AssetInfosOpt = Option<{ [key: string]: AssetInfo }>;

export const useAssetInfos = (): {
  assetInfos: AssetInfosOpt;
  isLoading: boolean;
} => {
  const assetsApiRoute = useBaseApiRoute("assets");

  const { data: assets, isLoading } = useQuery(
    ["query", "assetInfos", assetsApiRoute],
    async () => getAssetInfos(assetsApiRoute),
    { enabled: !!assetsApiRoute, retry: 1, refetchOnWindowFocus: false }
  );

  return {
    assetInfos: assets?.reduce(
      (acc, asset) => ({ ...acc, [asset.id]: asset }),
      {}
    ),
    isLoading,
  };
};

export const useNativeTokensInfo = (): UseQueryResult<Option<AssetInfo[]>> => {
  const feeTokensApiRoute = useBaseApiRoute("feeTokens");
  return useQuery(
    ["query", "nativeTokensInfo", feeTokensApiRoute],
    async () => getAssetInfos(feeTokensApiRoute),
    { enabled: !!feeTokensApiRoute, retry: 1, refetchOnWindowFocus: false }
  );
};
