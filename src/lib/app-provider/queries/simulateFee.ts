import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useDummyWallet, useRPCEndpoint } from "../hooks";
import type { ComposedMsg, Gas } from "lib/types";

interface SimulateQueryParams {
  enabled: boolean;
  messages: ComposedMsg[];
  isDummyUser?: boolean;
  onSuccess?: (gas: Gas<number> | undefined) => void;
  onError?: (err: Error) => void;
}

export const useSimulateFeeQuery = ({
  enabled,
  messages,
  isDummyUser,
  onSuccess,
  onError,
}: SimulateQueryParams) => {
  const { address, getCosmWasmClient, currentChainName } = useWallet();
  const { dummyWallet, dummyAddress } = useDummyWallet();
  const rpcEndpoint = useRPCEndpoint();
  const userAddress = isDummyUser ? dummyAddress : address || dummyAddress;

  const simulateFn = async (msgs: ComposedMsg[]) => {
    // TODO: revisit this logic
    if (!userAddress) {
      throw new Error("No user address");
    }

    const client =
      dummyWallet && (isDummyUser || !address)
        ? await SigningCosmWasmClient.connectWithSigner(
            rpcEndpoint,
            dummyWallet
          )
        : await getCosmWasmClient();

    if (!client) {
      throw new Error("Fail to get SigningCosmWasmClient");
    }

    return (await client.simulate(userAddress, msgs, undefined)) as Gas;
  };

  return useQuery({
    queryKey: [
      "simulate",
      currentChainName,
      userAddress,
      messages,
      rpcEndpoint,
    ],
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
