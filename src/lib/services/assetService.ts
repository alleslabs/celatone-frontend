import type { AssetInfo, AssetInfos, Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { useCelatoneApp } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { useBaseApiRoute } from "lib/app-provider/hooks/useBaseApiRoute";
import { getAssetInfos } from "lib/services/asset";
import { pickBy } from "lodash";

export const useAssetInfos = ({ withPrices }: { withPrices: boolean }) => {
  const assetsApiRoute = useBaseApiRoute("assets");

  const {
    chainConfig: { registry },
  } = useCelatoneApp();
  const registryAssets = registry?.assets ?? [];

  return useQuery<AssetInfos>(
    [CELATONE_QUERY_KEYS.ASSET_INFOS, assetsApiRoute, withPrices],
    async () =>
      getAssetInfos(assetsApiRoute, withPrices).then((assets) => {
        const assetsMap = assets.reduce<AssetInfos>(
          (acc, asset) => ({ ...acc, [asset.id]: asset }),
          {}
        );

        registryAssets.forEach((registryAsset) => {
          const asset: Option<AssetInfo> = assetsMap[registryAsset.base];
          assetsMap[registryAsset.base] = {
            coingecko: registryAsset.coingecko_id ?? asset?.coingecko ?? "",
            description: registryAsset.description ?? asset?.description ?? "",
            id: registryAsset.base,
            logo:
              registryAsset.logo_URIs?.svg ??
              registryAsset.logo_URIs?.png ??
              asset?.logo ??
              "",
            name: registryAsset.name,
            precision:
              registryAsset.denom_units.find(
                (unit) => unit.denom === registryAsset.symbol
              )?.exponent ??
              asset?.precision ??
              0,
            price: asset?.price ?? 0,
            slugs: registryAsset.coingecko_id
              ? [registryAsset.coingecko_id]
              : (asset?.slugs ?? []),
            symbol: registryAsset.symbol,
            type: asset?.type ?? "native",
          };
        });

        return assetsMap;
      }),
    { enabled: Boolean(assetsApiRoute), refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useAssetInfosByType = ({
  assetType,
}: {
  assetType: "all" | "native" | "cw20";
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
