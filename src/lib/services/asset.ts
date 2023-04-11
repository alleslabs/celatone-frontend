import axios from "axios";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import type { AssetInfo, Option } from "lib/types";

export const getAssetInfo = async (
  chainName: Option<string>,
  chainId: Option<string>,
  denom: string
): Promise<Option<AssetInfo>> => {
  if (!chainName || !chainId) throw new Error("Invalid chain (getAssetInfo)");
  if (!denom.trim().length) throw new Error("Empty denom");
  const { data } = await axios.get(
    `${CELATONE_API_ENDPOINT}/assets/${getChainApiPath(
      chainName
    )}/${chainId}/${denom}`
  );
  return data;
};

export const getAssetInfos = async (
  chainName: Option<string>,
  chainId: Option<string>
): Promise<Option<AssetInfo[]>> => {
  if (!chainName || !chainId) throw new Error("Invalid chain (getAssetInfos)");
  const { data } = await axios.get<AssetInfo[]>(
    `${CELATONE_API_ENDPOINT}/assets/${getChainApiPath(
      chainName
    )}/${chainId}/prices`
  );
  return data;
};
