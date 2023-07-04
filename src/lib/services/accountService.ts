import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useCelatoneApp, useBaseApiRoute } from "lib/app-provider";
import { getAccountIdByAddressQueryDocument } from "lib/query";
import type { Addr, Balance, Option } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  address: Addr
): UseQueryResult<Balance[]> => {
  const balancesApiRoute = useBaseApiRoute("balances");

  return useQuery(
    ["account_balance_info", address, balancesApiRoute],
    async () => getAccountBalanceInfo(balancesApiRoute, address as Addr),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAccountId = (
  walletAddress: Option<Addr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = () => {
    if (!walletAddress)
      throw new Error("Error fetching account id: failed to retrieve address.");
    return indexerGraphClient
      .request(getAccountIdByAddressQueryDocument, { address: walletAddress })
      .then<Option<number>>(({ accounts_by_pk }) => accounts_by_pk?.id);
  };
  return useQuery(["account_id", indexerGraphClient, walletAddress], queryFn, {
    enabled: Boolean(walletAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
