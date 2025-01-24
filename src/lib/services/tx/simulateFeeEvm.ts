import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { toBeHex } from "ethers";
import { useCelatoneApp } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { useCurrentChain } from "lib/app-provider/hooks";
import { type HexAddr20, type Option } from "lib/types";
import { bech32AddressToHex } from "lib/utils";
import { SimulatedFeeEvm } from "../types";
import { getSimulateFeeEvm } from "./jsonRpc";

interface SimulateQueryEvmParams {
  enabled: boolean;
  to: HexAddr20;
  data: string;
  value: string;
  retry?: UseQueryOptions["retry"];
  extraQueryKey?: UseQueryOptions["queryKey"];
  onSuccess?: (gas: Option<SimulatedFeeEvm>) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeEvmQuery = ({
  enabled,
  to,
  data,
  value,
  retry = 2,
  extraQueryKey = [],
  onSuccess,
  onError,
}: SimulateQueryEvmParams) => {
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();
  const { address } = useCurrentChain();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_EVM,
      address,
      to,
      data,
      value,
      ...extraQueryKey,
    ],
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useSimulateFeeEvmQuery)");
      if (!address)
        throw new Error("No address provided (useSimulateFeeEvmQuery)");

      return getSimulateFeeEvm(evm.jsonRpc, {
        from: bech32AddressToHex(address),
        to,
        data,
        value: toBeHex(value),
      });
    },
    enabled: enabled && !!address,
    retry,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
