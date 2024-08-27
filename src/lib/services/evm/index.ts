import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useLcdEndpoint } from "lib/app-provider";

import { getEvmParams } from "./lcd";

export const useEvmParams = () => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.EVM_PARAMS_LCD, lcdEndpoint],
    async () => getEvmParams(lcdEndpoint),
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      retryOnMount: false,
    }
  );
};
