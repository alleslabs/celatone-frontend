import type { Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { CELATONE_API_OVERRIDE } from "env";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { isUrl } from "lib/utils";

import { getApiChainConfigs } from "./api";

export const useApiChainConfigs = (
  networkTypes: string[],
  chain: Option<string>
) =>
  useQuery(
    [CELATONE_QUERY_KEYS.CHAIN_CONFIGS, networkTypes, chain],
    async () => getApiChainConfigs(networkTypes, chain),
    {
      enabled: isUrl(String(CELATONE_API_OVERRIDE)),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: Infinity,
    }
  );
