import axios from "axios";
import { z } from "zod";

import { AssetInfoSchema, type AssetInfo } from "lib/types";

export const getAssetInfos = async (
  baseApiRoute: string,
  withPrices: boolean
): Promise<AssetInfo[]> => {
  return axios
    .get(`${baseApiRoute}`, {
      params: {
        with_prices: withPrices,
      },
    })
    .then((res) => z.array(AssetInfoSchema).parse(res.data));
};
