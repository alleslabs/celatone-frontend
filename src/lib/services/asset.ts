import axios from "axios";
import { z } from "zod";

import type { AssetInfo } from "lib/types";
import { zAssetInfo } from "lib/types";

export const getAssetInfos = async (
  endpoint: string,
  withPrices: boolean
): Promise<AssetInfo[]> =>
  axios
    .get(`${endpoint}`, {
      params: {
        with_prices: withPrices,
      },
    })
    .then(({ data }) => z.array(zAssetInfo).parse(data));
