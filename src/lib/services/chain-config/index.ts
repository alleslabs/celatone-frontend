import type { NonInitiaChainConfig, Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { useInitia, useIsMainnet } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

import {
  getApiChainConfigs,
  getChainProfile,
  getNonInitiaChainConfig,
} from "./api";

export const useApiChainConfigs = (
  networkTypes: string[],
  chain: Option<string>
) =>
  useQuery({
    queryFn: () => getApiChainConfigs(networkTypes, chain),
    queryKey: [CELATONE_QUERY_KEYS.CHAIN_CONFIGS, networkTypes, chain],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
  });

export const useChainProfile = () => {
  const isInitia = useInitia();

  return useQuery({
    enabled: isInitia,
    queryFn: getChainProfile,
    queryKey: [CELATONE_QUERY_KEYS.CHAIN_PROFILE],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
  });
};

export const useNonInitiaChainConfig = (chainIds: string[]) => {
  const isMainnet = useIsMainnet();
  return useQuery({
    enabled: chainIds.length > 0,
    queryFn: () => getNonInitiaChainConfig(chainIds, isMainnet),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      CELATONE_QUERY_KEYS.NON_INITIA_CHAIN_CONFIG,
      isMainnet,
      [...chainIds].sort(),
    ],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) =>
      data.chains.reduce<Record<string, NonInitiaChainConfig>>(
        (acc, chain) => ({ ...acc, [chain.chain_id]: chain }),
        {}
      ),
    staleTime: Infinity,
  });
};
