import type { UseQueryOptions } from "@tanstack/react-query";
import type { HexAddr20, Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { toBeHex } from "ethers";
import { useCelatoneApp } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { useCurrentChain } from "lib/app-provider/hooks";
import { useQueryEvents } from "lib/hooks";
import { bech32AddressToHex } from "lib/utils";

import type { SimulatedFeeEvm } from "../types";

import { getSimulateFeeEvm } from "./jsonRpc";

interface SimulateQueryEvmParams {
  data: string;
  enabled: boolean;
  extraQueryKey?: UseQueryOptions["queryKey"];
  onError?: (err: Error) => void;
  onSuccess?: (gas: Option<SimulatedFeeEvm>) => void;
  retry?: UseQueryOptions["retry"];
  to: HexAddr20;
  value: string;
}

export const useSimulateFeeEvmQuery = ({
  data,
  enabled,
  onError,
  onSuccess,
  retry = 2,
  to,
  value,
}: SimulateQueryEvmParams) => {
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();
  const { address, walletProvider } = useCurrentChain();

  const simulateFeeEvmQuery = useQuery({
    enabled: enabled && !!address,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useSimulateFeeEvmQuery)");
      if (!address)
        throw new Error("No address provided (useSimulateFeeEvmQuery)");
      if (walletProvider.type !== "initia-widget")
        throw new Error("Please reconnect to EVM wallet");

      return getSimulateFeeEvm(evm.jsonRpc, {
        data,
        from: bech32AddressToHex(address),
        to,
        value: value ? toBeHex(value) : null,
      });
    },

    queryKey: [
      CELATONE_QUERY_KEYS.SIMULATE_FEE_EVM,
      walletProvider.type,
      address,
      evm,
      data,
      to,
      value,
    ],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry,
  });

  useQueryEvents(simulateFeeEvmQuery, {
    onError,
    onSuccess,
  });

  return simulateFeeEvmQuery;
};
