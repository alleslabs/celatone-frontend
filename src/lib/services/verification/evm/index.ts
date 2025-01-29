import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { getEvmVerifyConfig, getEvmVerifyInfo } from "./api";
import { HexAddr20, Option } from "lib/types";
import { useCurrentChain } from "lib/app-provider";

export const useEvmVerifyConfig = () =>
  useQuery({
    queryKey: [CELATONE_QUERY_KEYS.EVM_VERIFY_CONFIG],
    queryFn: getEvmVerifyConfig,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
    retryOnMount: false,
  });

export const useEvmVerifyInfo = (contractAddress: Option<HexAddr20>) => {
  const { chainId } = useCurrentChain();

  return useQuery({
    queryKey: [CELATONE_QUERY_KEYS.EVM_VERIFY_INFO, chainId, contractAddress],
    queryFn: () => {
      if (!contractAddress)
        throw new Error("contractAddress is undefined (useEvmVerifyInfo)");
      return getEvmVerifyInfo(chainId, contractAddress);
    },
    enabled: !!contractAddress,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
    retryOnMount: false,
  });
};
