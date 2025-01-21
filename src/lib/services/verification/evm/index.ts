import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { getEvmVerifyConfig } from "./api";

export const useEvmVerifyConfig = () =>
  useQuery({
    queryKey: [CELATONE_QUERY_KEYS.EVM_VERIFY_CONFIG],
    queryFn: getEvmVerifyConfig,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
    retryOnMount: false,
  });
