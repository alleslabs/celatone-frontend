import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { getAssetInfos } from "lib/services/asset";
import type { AssetInfo } from "lib/types";

export const useAssetInfos = (): UseQueryResult<Record<string, AssetInfo>> => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(
    async () =>
      getAssetInfos(
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id
      ),
    [currentChainRecord?.chain.chain_id, currentChainRecord?.name]
  );

  return useQuery(
    [
      "query",
      "assetInfos",
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    queryFn,
    { enabled: !!currentChainRecord }
  );
};
