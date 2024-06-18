import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import { getAccountTypeByAddressQueryDocument } from "lib/query";
import type { AccountType, BechAddr, Option } from "lib/types";

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
