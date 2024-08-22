import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

import { getApiChainConfigs } from "./api";

export const useApiChainConfigs = (chainIds: string[]) =>
  useQuery(
    [CELATONE_QUERY_KEYS.CHAIN_CONFIGS, chainIds],
    async () => getApiChainConfigs(chainIds),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
