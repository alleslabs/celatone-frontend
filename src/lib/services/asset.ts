import axios from "axios";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import type { AssetInfo, Option } from "lib/types";

export const getAssetInfo = async (
  chainName: Option<string>,
  chainId: Option<string>
): Promise<Option<AssetInfo[]>> => {
  if (!chainName || !chainId) return undefined;
  const { data } = await axios.get(
    `${CELATONE_API_ENDPOINT}/assets/${getChainApiPath(chainName)}/${chainId}`
  );
  return data;
};
