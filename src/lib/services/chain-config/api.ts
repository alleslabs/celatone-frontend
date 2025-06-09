import type { Option } from "lib/types";
import type { ChainProfile } from "lib/types/chainProfile";

import axios from "axios";
import { CELATONE_API_OVERRIDE } from "env";
import { CHAIN_PROFILE_URL } from "lib/data";
import { zChainConfig } from "lib/types";
import { zChainProfile } from "lib/types/chainProfile";
import { parseWithError } from "lib/utils";

export const getApiChainConfigs = (
  networkTypes: string[],
  chain: Option<string>
) =>
  axios
    .get(`${CELATONE_API_OVERRIDE}/v1/configs`, {
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
