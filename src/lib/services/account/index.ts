import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AccountType, BechAddr, Option } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { useCallback } from "react";

import type {
  AccountBech32RestResponse,
  AccountData,
  AccountTableCounts,
} from "../types";

import { getAccountData, getAccountTableCounts, getAccountType } from "./api";
import {
  getAccountBech32Rest,
  getAccountDataRest,
  getAccountTypeRest,
} from "./rest";

export const useAccountData = (
  address: BechAddr
): UseQueryResult<AccountData> => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("accounts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const endpoint = isFullTier ? apiEndpoint : restEndpoint;

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_DATA, endpoint, address],
    async () =>
      isFullTier
        ? getAccountData(endpoint, address)
        : getAccountDataRest(endpoint, address),
    { enabled: !!address, refetchOnWindowFocus: false, retry: 1 }
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
    { refetchOnWindowFocus: false, retry: 1, ...options }
  );
};

export const useAccountType = (
  address: Option<BechAddr>,
  options: Pick<
    UseQueryOptions<AccountType, Error>,
    "enabled" | "onSuccess" | "onError"
  > = {}
): UseQueryResult<AccountType> => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("accounts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!address)
      throw new Error(
        "Fetching account type: failed to retrieve address. (useAccountTypeRest)"
      );

    if (isFullTier) return getAccountType(apiEndpoint, address);

    return getAccountTypeRest(restEndpoint, address);
  }, [restEndpoint, address, apiEndpoint, isFullTier]);

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_TYPE, apiEndpoint, restEndpoint, address],
    queryFn,
    {
      ...options,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useAccountBech32 = (
  endpoint: string
): UseQueryResult<AccountBech32RestResponse> =>
  useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_BECH_32_REST, endpoint],
    async () => getAccountBech32Rest(endpoint),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
