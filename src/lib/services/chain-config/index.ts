import { useQuery } from "@tanstack/react-query";

import { CELATONE_API_OVERRIDE } from "env";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { isUrl } from "lib/utils";

import { getApiChainConfigs } from "./api";

export const useApiChainConfigs = (chainIds: string[]) =>
  useQuery(
    [CELATONE_QUERY_KEYS.CHAIN_CONFIGS, chainIds],
    async () => getApiChainConfigs(chainIds),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: isUrl(String(CELATONE_API_OVERRIDE)),
    }
  );
