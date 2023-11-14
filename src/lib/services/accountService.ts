import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  useCelatoneApp,
  useBaseApiRoute,
  CELATONE_QUERY_KEYS,
} from "lib/app-provider";
import {
  getAccountIdByAddressQueryDocument,
  getAccountTypeByAddressQueryDocument,
} from "lib/query";
import type { AccountType, Addr, Balance, Nullable, Option } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  address: Addr
): UseQueryResult<Balance[]> => {
  const balancesApiRoute = useBaseApiRoute("balances");

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_BALANCES_INFO, address, balancesApiRoute],
    async () => getAccountBalanceInfo(balancesApiRoute, address as Addr),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAccountId = (
  walletAddress: Option<Addr>
): UseQueryResult<Nullable<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error("Error fetching account id: failed to retrieve address.");
    return indexerGraphClient
      .request(getAccountIdByAddressQueryDocument, { address: walletAddress })
      .then<Nullable<number>>(
        ({ accounts_by_pk }) => accounts_by_pk?.id ?? null
      );
  }, [indexerGraphClient, walletAddress]);

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_ID, indexerGraphClient, walletAddress],
    queryFn,
    {
      enabled: Boolean(walletAddress),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAccountType = (
  walletAddress: Option<Addr>,
  options: Pick<
    UseQueryOptions<AccountType, Error>,
    "enabled" | "onSuccess" | "onError"
  > = {}
): UseQueryResult<AccountType> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Error fetching account type: failed to retrieve address."
      );
    return indexerGraphClient
      .request(getAccountTypeByAddressQueryDocument, {
        address: walletAddress,
      })
      .then(
        ({ accounts_by_pk }) =>
          (accounts_by_pk?.type ?? "BaseAccount") as AccountType
      );
  }, [indexerGraphClient, walletAddress]);

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_TYPE, indexerGraphClient, walletAddress],
    queryFn,
    {
      ...options,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
