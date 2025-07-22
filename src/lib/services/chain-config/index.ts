import type { Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { CHAIN, SCAN_API } from "env";
import { useInitia } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { isUrl } from "lib/utils";

import { getApiChainConfigs, getChainProfile } from "./api";

export const useApiChainConfigs = (
  networkTypes: string[],
  chain: Option<string>
) => {
  const endpoint =
    CHAIN === "initia" ? `${SCAN_API}/v1/chains` : `${SCAN_API}/v1/configs`;

  return useQuery(
    [CELATONE_QUERY_KEYS.CHAIN_CONFIGS, networkTypes, chain],
    () => getApiChainConfigs(endpoint, networkTypes, chain),
    {
      enabled: isUrl(String(SCAN_API)),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: Infinity,
    }
  );
};

export const useChainProfile = () => {
  const isInitia = useInitia();

  return useQuery([CELATONE_QUERY_KEYS.CHAIN_PROFILE], getChainProfile, {
    enabled: isInitia,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
  });
};
