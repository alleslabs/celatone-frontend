import type { EncodeObject } from "@cosmjs/proto-signing";
import { useCallback } from "react";
import { z } from "zod";

import type { BechAddr20, Gas } from "lib/types";
import { zGas } from "lib/types";

import { useCurrentChain } from "./useCurrentChain";
import { useDummyWallet } from "./useDummyWallet";
import { useGetSigningClient } from "./useGetSigningClient";

interface SimulateFeeParams {
  address: BechAddr20;
  messages: EncodeObject[];
  isDummyUser?: boolean;
}

export const useSimulateFee = () => {
  const {
    address: connectedAddress,
    chainId,
    walletProvider,
  } = useCurrentChain();
  const { dummyClient } = useDummyWallet();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      address,
      messages,
      isDummyUser = false,
    }: SimulateFeeParams): Promise<Gas> => {
      // Remark: If the user is not connected, use the dummy client
      const shouldUseDummyClient = isDummyUser || !connectedAddress;

      if (shouldUseDummyClient) {
        if (!dummyClient) {
          throw new Error("Dummy client is not initialized (useSimulateFee)");
        }
        // Simulate fee using the dummy client
        return dummyClient
          .simulate(address, messages, undefined)
          .then(zGas(z.number()).parse);
      }

      // If the user has connected with Initia Widget
      if (walletProvider.type === "initia-widget") {
        const { estimateTx } = walletProvider.context;
        return estimateTx({ messages }, chainId).then(zGas(z.number()).parse);
      }

      // Otherwise, use the CosmosKit
      const client = await getSigningClient();
      return client
        .simulate(address, messages, undefined)
        .then(zGas(z.number()).parse);
    },
    [
      connectedAddress,
      walletProvider.type,
      walletProvider.context,
      dummyClient,
      getSigningClient,
      chainId,
    ]
  );
};
