import type { HexAddr20 } from "lib/types";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentChain } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { isHex20Bytes } from "lib/utils/validate";

import { getEvmVerifyConfig, getEvmVerifyInfos, submitEvmVerify } from "./api";

export const useEvmVerifyConfig = () =>
  useQuery({
    queryFn: getEvmVerifyConfig,
    queryKey: [CELATONE_QUERY_KEYS.EVM_VERIFY_CONFIG],
    refetchOnWindowFocus: false,
    retry: 1,
    retryOnMount: false,
    staleTime: Infinity,
  });

export const useEvmVerifyInfos = (contractAddresses: HexAddr20[]) => {
  const { chainId } = useCurrentChain();

  return useQuery({
    enabled:
      contractAddresses.length > 0 && contractAddresses.every(isHex20Bytes),
    queryFn: () => {
      if (contractAddresses.length === 0)
        throw new Error("contractAddresses is empty (useEvmVerifyInfo)");
      return getEvmVerifyInfos(chainId, contractAddresses);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_VERIFY_INFOS,
      chainId,
      contractAddresses,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
    retryOnMount: false,
    staleTime: Infinity,
  });
};

export const useSubmitEvmVerify = () =>
  useMutation({
    mutationFn: submitEvmVerify,
  });
