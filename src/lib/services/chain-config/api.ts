import type { Option } from "lib/types";
import type { ChainProfile } from "lib/types/chainProfile";

import axios from "axios";
import { CHAIN_PROFILE_URL } from "lib/data";
import { zChainConfig } from "lib/types";
import { zChainProfile } from "lib/types/chainProfile";
import { parseWithError } from "lib/utils";

export const getApiChainConfigs = (
  endpoint: string,
  networkTypes: string[],
  chain: Option<string>
) =>
  axios
    .get(endpoint, {
      params: {
        chain,
        network_types: networkTypes.join(","),
      },
    })
    .then(({ data }) => parseWithError(zChainConfig.array(), data));

export const getChainProfile = () =>
  axios.get(CHAIN_PROFILE_URL).then(({ data }) => {
    const chainProfiles = parseWithError(zChainProfile.array(), data);
    return chainProfiles.reduce<Record<string, ChainProfile>>(
      (acc, profile) => ({ ...acc, [profile.pretty_name]: profile }),
      {}
    );
  });
