import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useBaseApiRoute } from "lib/app-provider";
import type { Addr, Balance } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  walletAddress: Addr
): UseQueryResult<Balance[]> => {
  const { currentChainRecord } = useWallet();
  const baseApiRoute = useBaseApiRoute("balances");

  return useQuery(
    [
      "account_balance_info",
      walletAddress,
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    async () => getAccountBalanceInfo(baseApiRoute, walletAddress as Addr),
    { enabled: !!currentChainRecord || !!walletAddress }
  );
};
