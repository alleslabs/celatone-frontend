import type { Option } from "lib/types";
import type { ChainProfile } from "lib/types/chainProfile";

import axios from "axios";
import { CHAIN, ROUTER_API, SCAN_API } from "env";
import { CHAIN_PROFILE_URL } from "lib/data";
import { zChainConfig, zNonInitiaChainConfig } from "lib/types";
import { zChainProfile } from "lib/types/chainProfile";
import { isUrl, parseWithError } from "lib/utils";
import { z } from "zod";

export const getApiChainConfigs = (
  networkTypes: string[],
  chain: Option<string>
) => {
  const endpoint =
    CHAIN === "initia" ? `${SCAN_API}/v1/chains` : `${SCAN_API}/v1/configs`;

  if (!isUrl(String(endpoint))) {
    throw new Error(
      `Endpoint is not a valid URL (getApiChainConfigs): ${endpoint}`
    );
  }

  return axios
    .get(endpoint, {
      params: {
        chain,
        network_types: networkTypes.join(","),
      },
    })
    .then(({ data }) => parseWithError(zChainConfig.array(), data));
};

export const getChainProfile = () =>
  axios.get(CHAIN_PROFILE_URL).then(({ data }) => {
    const chainProfiles = parseWithError(zChainProfile.array(), data);
    return chainProfiles.reduce<Record<string, ChainProfile>>(
      (acc, profile) => ({ ...acc, [profile.pretty_name]: profile }),
      {}
    );
  });

export const getNonInitiaChainConfig = async (chainIds: string[]) => {
  const endpoint = `${ROUTER_API}/v2/info/chains`;
  if (!isUrl(endpoint)) {
    throw new Error(
      `Endpoint is not a valid URL (getNonInitiaChainConfig): ${endpoint}`
    );
  }

  const { data } = await axios.get(endpoint, {
    params: {
      chain_ids: chainIds.join(","),
      include_evm: true,
      include_initia_mainnet: true,
      only_testnets: false,
    },
  });

  return parseWithError(
    z.object({ chains: zNonInitiaChainConfig.array() }),
    data
  );
};
