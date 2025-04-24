import type { AssetInfo } from "lib/types";

import axios from "axios";
import { zAssetInfo } from "lib/types";
import { parseWithError } from "lib/utils";
import { z } from "zod";

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
    .then(({ data }) => parseWithError(z.array(zAssetInfo), data));
