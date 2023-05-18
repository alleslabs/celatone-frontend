import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useBaseApiRoute } from "lib/app-provider";
import type { Addr, Balance } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  address: Addr
): UseQueryResult<Balance[]> => {
  const balancesApiRoute = useBaseApiRoute("balances");

  return useQuery(
    ["account_balance_info", address, balancesApiRoute],
    async () => getAccountBalanceInfo(balancesApiRoute, address as Addr),
    { enabled: !!balancesApiRoute && !!address }
  );
};
