import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentChain } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import type { HexAddr20 } from "lib/types";
import { isHex20Bytes } from "lib/utils/validate";
import { getEvmVerifyConfig, getEvmVerifyInfos, submitEvmVerify } from "./api";

export const useEvmVerifyConfig = () =>
  useQuery({
    queryKey: [CELATONE_QUERY_KEYS.EVM_VERIFY_CONFIG],
    queryFn: getEvmVerifyConfig,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: Infinity,
    retryOnMount: false,
  });

export const useEvmVerifyInfos = (contractAddresses: HexAddr20[]) => {
  const { chainId } = useCurrentChain();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_VERIFY_INFOS,
      chainId,
      contractAddresses,
    ],
    queryFn: () => {
      if (contractAddresses.length === 0)
        throw new Error("contractAddresses is empty (useEvmVerifyInfo)");
      return getEvmVerifyInfos(chainId, contractAddresses);
    },
    enabled:
      contractAddresses.length > 0 && contractAddresses.every(isHex20Bytes),
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
