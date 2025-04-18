import type { UseQueryOptions } from "@tanstack/react-query";
import type { HexAddr20, Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { toBeHex } from "ethers";
import { useCelatoneApp } from "lib/app-provider";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import { useCurrentChain } from "lib/app-provider/hooks";
import { bech32AddressToHex } from "lib/utils";

import type { SimulatedFeeEvm } from "../types";

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
  data,
  enabled,
  extraQueryKey = [],
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

  return useQuery({
    enabled: enabled && !!address,
    onError,
    onSuccess,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useSimulateFeeEvmQuery)");
      if (!address)
        throw new Error("No address provided (useSimulateFeeEvmQuery)");
      if (
        walletProvider.type !== "initia-widget" ||
        walletProvider.context.wallet?.type !== "evm"
      )
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
      address,
      to,
      data,
      value,
      ...extraQueryKey,
    ],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry,
  });
};
