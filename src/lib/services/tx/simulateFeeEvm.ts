import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { TransactionRequest } from "ethers";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { useCurrentChain, useSimulateFeeEvm } from "lib/app-provider/hooks";
import type { Gas, Option } from "lib/types";

interface SimulateQueryEvmParams {
  enabled: boolean;
  request: TransactionRequest;
  retry?: UseQueryOptions["retry"];
  extraQueryKey?: UseQueryOptions["queryKey"];
  onSuccess?: (gas: Option<Gas>) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeEvmQuery = ({
  enabled,
  request,
  retry = 2,
  extraQueryKey = [],
  onSuccess,
  onError,
}: SimulateQueryEvmParams) => {
  const { address } = useCurrentChain();
  const simulateFeeEvm = useSimulateFeeEvm();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_EVM,
      request,
      address,
      ...extraQueryKey,
    ],
    queryFn: () => simulateFeeEvm(request),
    enabled,
    retry,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
