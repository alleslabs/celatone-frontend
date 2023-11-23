import axios from "axios";

import type { AssetInfo } from "lib/types";

export const getAssetInfos = async (
  baseApiRoute: string,
  withPrices: boolean
): Promise<AssetInfo[]> => {
  const { data } = await axios.get<AssetInfo[]>(`${baseApiRoute}`, {
    params: {
      with_prices: withPrices,
    },
  });
  return data;
};
