import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  useCelatoneApp,
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useWasmConfig,
  useGovConfig,
} from "lib/app-provider";
import { getAccountTypeByAddressQueryDocument } from "lib/query";
import type { AccountType, Addr, Option } from "lib/types";

import {
  getAccountInfo,
  type AccountInfo,
  getAccountTableCounts,
  type AccountTableCounts,
} from "./account";

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
    [CELATONE_QUERY_KEYS.ACCOUNT_DATA, endpoint, address],
    async () => getAccountInfo(endpoint, address),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAccountTableCounts = (
  address: Addr
): UseQueryResult<AccountTableCounts> => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.TABLE_COUNTS, endpoint, address, isGov, isWasm],
    async () => getAccountTableCounts(endpoint, address, isGov, isWasm),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};
