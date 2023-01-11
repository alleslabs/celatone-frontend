import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_API_ENDPOINT, getChain } from "lib/data";
import type { AssetInfo, Option } from "lib/types";

const getAssetInfo = async (
  chainName: Option<string>,
  chainId: Option<string>
) => {
  if (!chainName || !chainId) return undefined;
  const { data } = await axios.get(
    `${CELATONE_API_ENDPOINT}/assets/${getChain(chainName)}/${chainId}`
  );
  return data;
};

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
  const assetMap: { [key: string]: AssetInfo } = {};
  assets.forEach((asset: AssetInfo) => {
    Object.assign(assetMap, { [asset.id]: asset });
  });
  return assetMap;
};
