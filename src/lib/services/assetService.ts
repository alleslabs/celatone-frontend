import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import {
  getAssetInfos,
  getAssetInfosWithoutPricesPath,
} from "lib/services/asset";
import type { AssetInfo, Option } from "lib/types";

export type AssetInfosOpt = Option<{ [key: string]: AssetInfo }>;

export const useAssetInfos = ({
  withPrices,
}: {
  withPrices: boolean;
}): {
  assetInfos: AssetInfosOpt;
  isLoading: boolean;
} => {
  const assetsApiRoute = useBaseApiRoute("assets");
  const fetchFn = withPrices ? getAssetInfos : getAssetInfosWithoutPricesPath;
  const { data: assets, isLoading } = useQuery(
    [CELATONE_QUERY_KEYS.ASSET_INFOS, assetsApiRoute, withPrices],
    async () => fetchFn(assetsApiRoute),
    { enabled: Boolean(assetsApiRoute), retry: 1, refetchOnWindowFocus: false }
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
    async () => getAssetInfosWithoutPricesPath(assetsApiRoute),
    { enabled: Boolean(assetsApiRoute), retry: 1, refetchOnWindowFocus: false }
  );
};

export const useNativeTokensInfo = () => {
  const nativeTokensApiRoute = useBaseApiRoute("native_tokens");

  return useQuery(
    [CELATONE_QUERY_KEYS.NATIVE_TOKENS_INFO, nativeTokensApiRoute],
    async () => getAssetInfosWithoutPricesPath(nativeTokensApiRoute),
    {
      enabled: Boolean(nativeTokensApiRoute),
      refetchOnWindowFocus: false,
    }
  );
};
