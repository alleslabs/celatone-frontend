import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AccountType, AccountTypeRest, BechAddr, Option } from "lib/types";

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
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const endpoint = isFullTier ? apiEndpoint : restEndpoint;

  return useQuery({
    enabled: !!address,
    queryFn: async () => {
      if (isFullTier) return getAccountData(endpoint, address);
      if (isWasm) return getAccountDataRest(endpoint, address);

      throw new Error("Account data not found (useAccountData)");
    },
    queryKey: [
      CELATONE_QUERY_KEYS.ACCOUNT_DATA,
      endpoint,
      address,
      isFullTier,
      isWasm,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAccountTableCounts = (
  address: BechAddr,
  options?: Partial<UseQueryOptions<AccountTableCounts>>
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });

  return useQuery<AccountTableCounts>({
    queryFn: async () =>
      getAccountTableCounts(endpoint, address, isGov, isWasm),
    queryKey: [
      CELATONE_QUERY_KEYS.ACCOUNT_TABLE_COUNTS,
      endpoint,
      address,
      isGov,
      isWasm,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useAccountType = (
  address: Option<BechAddr>,
  enabled = false
): UseQueryResult<AccountType | AccountTypeRest> => {
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

  return useQuery({
    enabled: enabled && Boolean(address),
    queryFn,
    queryKey: [
      CELATONE_QUERY_KEYS.ACCOUNT_TYPE,
      apiEndpoint,
      restEndpoint,
      address,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAccountBech32 = (
  endpoint: string
): UseQueryResult<AccountBech32RestResponse> =>
  useQuery({
    queryFn: async () => getAccountBech32Rest(endpoint),
    queryKey: [CELATONE_QUERY_KEYS.ACCOUNT_BECH_32_REST, endpoint],
    refetchOnWindowFocus: false,
    retry: 1,
  });
