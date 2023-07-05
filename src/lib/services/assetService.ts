import { useQuery } from "@tanstack/react-query";

import { useBaseApiRoute } from "lib/app-provider";
import { getAssetInfos, getNativeAssetInfos } from "lib/services/asset";
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

export const useAssetInfoList = () => {
  const assetsApiRoute = useBaseApiRoute("assets");
  return useQuery(
    ["query", "assetInfosList", assetsApiRoute],
    async () => getAssetInfos(assetsApiRoute),
    { enabled: !!assetsApiRoute, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useNativeTokensInfo = () => {
  const nativeTokensApiRoute = useBaseApiRoute("native_tokens");

  return useQuery(
    ["query", "nativeTokensInfo", nativeTokensApiRoute],
    async () => getNativeAssetInfos(nativeTokensApiRoute),
    {
      enabled: !!nativeTokensApiRoute,
      refetchOnWindowFocus: false,
    }
  );
};
