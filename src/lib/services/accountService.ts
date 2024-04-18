import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useWasmConfig,
} from "lib/app-provider";
import { getAccountTypeByAddressQueryDocument } from "lib/query";
import type { AccountType, BechAddr, Option } from "lib/types";

import { getAccountData, getAccountTableCounts } from "./account";
import type { AccountData, AccountTableCounts } from "./account";

export const useAccountType = (
  address: Option<BechAddr>,
  options: Pick<
    UseQueryOptions<AccountType, Error>,
    "enabled" | "onSuccess" | "onError"
  > = {}
): UseQueryResult<AccountType> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!address)
      throw new Error(
        "Error fetching account type: failed to retrieve address."
      );
    return indexerGraphClient
      .request(getAccountTypeByAddressQueryDocument, {
        address,
      })
      .then(
        ({ accounts_by_pk }) =>
          (accounts_by_pk?.type ?? "BaseAccount") as AccountType
      );
  }, [indexerGraphClient, address]);

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_TYPE, indexerGraphClient, address],
    queryFn,
    {
      ...options,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAccountData = (
  address: BechAddr
): UseQueryResult<AccountData> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_DATA, endpoint, address],
    async () => getAccountData(endpoint, address),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAccountTableCounts = (
  address: BechAddr
): UseQueryResult<AccountTableCounts> => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ACCOUNT_TABLE_COUNTS,
      endpoint,
      address,
      isGov,
      isWasm,
    ],
    async () => getAccountTableCounts(endpoint, address, isGov, isWasm),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};
