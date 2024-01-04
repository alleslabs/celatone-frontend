import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { useBaseApiRoute } from "lib/app-provider/hooks/useBaseApiRoute";
import { getAssetInfos } from "lib/services/asset";
import type { AssetInfos } from "lib/types";

export const useAssetInfos = ({ withPrices }: { withPrices: boolean }) => {
  const assetsApiRoute = useBaseApiRoute("assets");
  return useQuery<AssetInfos>(
    [CELATONE_QUERY_KEYS.ASSET_INFOS, assetsApiRoute, withPrices],
    async () =>
      getAssetInfos(assetsApiRoute, withPrices).then((assets) =>
        assets.reduce((acc, asset) => ({ ...acc, [asset.id]: asset }), {})
      ),
    { enabled: Boolean(assetsApiRoute), retry: 1, refetchOnWindowFocus: false }
  );
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
