import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import { getAssetInfos, getNativeAssetInfos } from "lib/services/asset";
import type { AssetInfo, Option } from "lib/types";

export type AssetInfosOpt = Option<{ [key: string]: AssetInfo }>;

export const useAssetInfos = (): {
  assetInfos: AssetInfosOpt;
  isLoading: boolean;
} => {
  const assetsApiRoute = useBaseApiRoute("assets");

  const { data: assets, isLoading } = useQuery(
    [CELATONE_QUERY_KEYS.ASSET_INFOS, assetsApiRoute],
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

export const useAssetInfoList = () => {
  const assetsApiRoute = useBaseApiRoute("assets");
  return useQuery(
    [CELATONE_QUERY_KEYS.ASSET_INFO_LIST, assetsApiRoute],
    async () => getAssetInfos(assetsApiRoute),
    { enabled: !!assetsApiRoute, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useNativeTokensInfo = () => {
  const nativeTokensApiRoute = useBaseApiRoute("native_tokens");

  return useQuery(
    [CELATONE_QUERY_KEYS.NATIVE_TOKENS_INFO, nativeTokensApiRoute],
    async () => getNativeAssetInfos(nativeTokensApiRoute),
    {
      enabled: !!nativeTokensApiRoute,
      refetchOnWindowFocus: false,
    }
  );
};
