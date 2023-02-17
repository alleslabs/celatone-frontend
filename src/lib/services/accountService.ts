import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Balance, HumanAddr, Option } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  address: Option<HumanAddr>
): UseQueryResult<Balance[]> => {
  const { currentChainRecord } = useWallet();

  return useQuery(
    [
      "account_balance_info",
      address,
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    async () =>
      getAccountBalanceInfo(
        address as HumanAddr,
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id
      ),
    { enabled: !!currentChainRecord || !!address }
  );
};
