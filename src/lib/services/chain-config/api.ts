import type { ChainConfig } from "@alleslabs/shared";
import axios from "axios";

import { CELATONE_API_OVERRIDE } from "env";

export const getApiChainConfigs = async (chainIds: string[]) =>
  axios
    .get(`${CELATONE_API_OVERRIDE}/v1/configs`, {
      params: {
        ids: chainIds.join(","),
      },
    })
    .then<ChainConfig[]>((res) => res.data);
