import axios from "axios";

import { CELATONE_API_OVERRIDE } from "env";
import { zChainConfig } from "lib/types";
import { parseWithError } from "lib/utils";

export const getApiChainConfigs = async (chainIds: string[]) =>
  axios
    .get(`${CELATONE_API_OVERRIDE}/v1/configs`, {
      params: {
        ids: chainIds.join(","),
      },
    })
    .then(({ data }) => parseWithError(zChainConfig.array(), data));
