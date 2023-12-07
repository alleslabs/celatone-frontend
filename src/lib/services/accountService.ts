import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  useCelatoneApp,
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useWasmConfig,
} from "lib/app-provider";
import {
  getAccountIdByAddressQueryDocument,
  getAccountTypeByAddressQueryDocument,
} from "lib/query";
import type { AccountType, Addr, Nullable, Option } from "lib/types";

import {
  getAccountInfo,
  type AccountInfo,
  getAccountTableCount,
  type AccountTableCount,
} from "./account";

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

export const useAccountInfo = (address: Addr): UseQueryResult<AccountInfo> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.BALANCES, endpoint, address],
    async () => getAccountInfo(endpoint, address),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAccountTableCount = (
  address: Addr
): UseQueryResult<AccountTableCount> => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.TABLE_COUNTS, endpoint, address, isWasm],
    async () => getAccountTableCount(endpoint, address, isWasm),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};
