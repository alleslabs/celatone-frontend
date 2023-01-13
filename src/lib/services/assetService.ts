import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { getAssetInfo } from "lib/services/asset";
import type { AssetInfo, Option } from "lib/types";

export const useAssetInfos = (): Option<{ [key: string]: AssetInfo }> => {
  const { currentChainRecord } = useWallet();

  const { data: assets } = useQuery(
    [
      "query",
      "assetInfos",
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    async () =>
      getAssetInfo(
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id
      ),
    { enabled: !!currentChainRecord }
  );

  if (!assets) return undefined;
  return assets.reduce((acc, asset) => ({ ...acc, [asset.id]: asset }), {});
};
