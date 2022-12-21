import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useDummyWallet } from "lib/hooks";
import type { ComposedMsg, Gas } from "lib/types";

interface SimulateQueryParams {
  enabled: boolean;
  messages: ComposedMsg[];
  onSuccess?: (gas: Gas<number> | undefined) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeQuery = ({
  enabled,
  messages,
  onSuccess,
  onError,
}: SimulateQueryParams) => {
  const { address, getCosmWasmClient, currentChainName, currentChainRecord } =
    useWallet();
  const { dummyWallet, dummyAddress } = useDummyWallet();

  const simulateFn = async (msgs: ComposedMsg[]) => {
    let client = await getCosmWasmClient();
    if (
      !currentChainRecord ||
      !currentChainRecord.preferredEndpoints ||
      !currentChainRecord.preferredEndpoints.rpc ||
      !currentChainRecord.preferredEndpoints.rpc[0]
    ) {
      return Promise.resolve(undefined);
    }

    if (!client && !address && dummyWallet) {
      client = await SigningCosmWasmClient.connectWithSigner(
        currentChainRecord.preferredEndpoints.rpc[0],
        dummyWallet
      );
    }

    if (!client || !dummyAddress) {
      return Promise.resolve(undefined);
    }

    return (await client.simulate(
      address || dummyAddress,
      msgs,
      undefined
    )) as Gas;
  };

  return useQuery({
    queryKey: ["simulate", currentChainName, address, messages],
    queryFn: async ({ queryKey }) => simulateFn(queryKey[3] as ComposedMsg[]),
    enabled,
    keepPreviousData: true,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
