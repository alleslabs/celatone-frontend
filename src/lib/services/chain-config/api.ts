import type { Option } from "lib/types";

import axios from "axios";
import { CELATONE_API_OVERRIDE } from "env";
import { zChainConfig } from "lib/types";
import { parseWithError } from "lib/utils";

export const getApiChainConfigs = async (
  networkTypes: string[],
  chain: Option<string>
) =>
  axios
    .get(`${CELATONE_API_OVERRIDE}/v1/configs`, {
      params: {
        network_types: networkTypes.join(","),
        chain,
      },
    })
    .then(({ data }) => parseWithError(zChainConfig.array(), data));
