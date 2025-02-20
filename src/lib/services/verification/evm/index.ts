import { useMutation, useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { getEvmVerifyConfig, getEvmVerifyInfo, submitEvmVerify } from "./api";
import type { HexAddr20, Option } from "lib/types";
import { useCurrentChain } from "lib/app-provider";
import { isHex20Bytes } from "lib/utils/validate";

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
    enabled: !!contractAddress && isHex20Bytes(contractAddress),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
    retryOnMount: false,
  });
};

export const useSubmitEvmVerify = () =>
  useMutation({
    mutationFn: submitEvmVerify,
  });
