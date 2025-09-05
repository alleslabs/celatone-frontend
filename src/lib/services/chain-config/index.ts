import type { Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { useInitia } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

import { getApiChainConfigs, getChainProfile } from "./api";

export const useApiChainConfigs = (
  networkTypes: string[],
  chain: Option<string>
) =>
  useQuery(
    [CELATONE_QUERY_KEYS.CHAIN_CONFIGS, networkTypes, chain],
    () => getApiChainConfigs(networkTypes, chain),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: Infinity,
    }
  );

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
