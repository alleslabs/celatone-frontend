import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import type { AccountData, AccountTableCounts } from "../types";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useLcdEndpoint,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import type { AccountType, BechAddr, Option } from "lib/types";

import { getAccountData, getAccountTableCounts } from "./api";
import { getAccountDataLcd, getAccountTypeLcd } from "./lcd";

export const useAccountData = (
  address: BechAddr
): UseQueryResult<AccountData> => {
  const isFullTier = useTierConfig() === "full";
  const apiEndpoint = useBaseApiRoute("accounts");
  const lcdEndpoint = useLcdEndpoint();
  const endpoint = isFullTier ? apiEndpoint : lcdEndpoint;

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_DATA, endpoint, address],
    async () =>
      isFullTier
        ? getAccountData(endpoint, address)
        : getAccountDataLcd(endpoint, address),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAccountTableCounts = (
  address: BechAddr,
  options?: UseQueryOptions<AccountTableCounts>
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });

  return useQuery<AccountTableCounts>(
    [
      CELATONE_QUERY_KEYS.ACCOUNT_TABLE_COUNTS,
      endpoint,
      address,
      isGov,
      isWasm,
    ],
    async () => getAccountTableCounts(endpoint, address, isGov, isWasm),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useAccountTypeLcd = (
  address: Option<BechAddr>,
  options: Pick<
    UseQueryOptions<AccountType, Error>,
    "enabled" | "onSuccess" | "onError"
  > = {}
): UseQueryResult<AccountType> => {
  const lcdEndpoint = useLcdEndpoint();

  const queryFn = useCallback(async () => {
    if (!address)
      throw new Error(
        "Fetching account type: failed to retrieve address. (useAccountTypeLcd)"
      );

    return getAccountTypeLcd(lcdEndpoint, address);
  }, [lcdEndpoint, address]);

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_TYPE_LCD, lcdEndpoint, address],
    queryFn,
    {
      ...options,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export * from "./gql";
