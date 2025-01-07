import { useQuery } from "@tanstack/react-query";
import { pickBy } from "lodash";

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
    { enabled: Boolean(assetsApiRoute), refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useAssetInfosByType = ({
  assetType,
}: {
  assetType: "all" | "cw20" | "native";
}) => {
  const { data, ...rest } = useAssetInfos({ withPrices: true });

  if (assetType === "all") return { data, ...rest };

  return {
    data: data
      ? pickBy(data, (assetInfo) => assetInfo.type === assetType)
      : undefined,
    ...rest,
  };
};
