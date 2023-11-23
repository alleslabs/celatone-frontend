import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import { getAssetInfos } from "lib/services/asset";
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
  const { data: assets, isLoading } = useQuery(
    [CELATONE_QUERY_KEYS.ASSET_INFOS, assetsApiRoute, withPrices],
    async () => getAssetInfos(assetsApiRoute, withPrices),
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

export const useAssetInfoList = ({
  assetType,
}: {
  assetType: "all" | "native" | "cw20";
}) => {
  const assetsApiRoute = useBaseApiRoute("assets").concat(
    assetType !== "all" ? `/type/${assetType}` : ""
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.ASSET_INFO_LIST, assetsApiRoute],
    async () => getAssetInfos(assetsApiRoute, false),
    {
      enabled: Boolean(assetsApiRoute),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
