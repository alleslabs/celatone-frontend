import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

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
  const { address, getCosmWasmClient, currentChainName } = useWallet();
  const simulateFn = async (msgs: ComposedMsg[]) => {
    const client = await getCosmWasmClient();
    if (!client || !address) {
      return Promise.resolve(undefined);
    }
    return (await client.simulate(address, msgs, undefined)) as Gas;
  };

  // TODO: make this as query key constant
  return useQuery({
    queryKey: ["simulate", currentChainName, address, messages],
    queryFn: async ({ queryKey }) => {
      return simulateFn(queryKey[3] as ComposedMsg[]);
    },
    enabled,
    keepPreviousData: true,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onSuccess,
    onError,
  });
};
