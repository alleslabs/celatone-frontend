import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Balance, HumanAddr } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  walletAddress: HumanAddr
): UseQueryResult<Balance[]> => {
  const { currentChainRecord } = useWallet();

  return useQuery(
    [
      "account_balance_info",
      walletAddress,
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    async () =>
      getAccountBalanceInfo(
        walletAddress as HumanAddr,
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id
      ),
    { enabled: !!currentChainRecord || !!walletAddress }
  );
};
