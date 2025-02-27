import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import type { AccountType, BechAddr, Option } from "lib/types";

import { getAccountData, getAccountTableCounts, getAccountType } from "./api";
import {
  getAccountBech32Lcd,
  getAccountDataLcd,
  getAccountTypeLcd,
} from "./lcd";
import type {
  AccountBech32LcdResponse,
  AccountData,
  AccountTableCounts,
} from "../types";

export const useAccountData = (
  address: BechAddr
): UseQueryResult<AccountData> => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("accounts");
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
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
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!address)
      throw new Error(
        "Fetching account type: failed to retrieve address. (useAccountTypeLcd)"
      );

    if (isFullTier) return getAccountType(apiEndpoint, address);

    return getAccountTypeLcd(lcdEndpoint, address);
  }, [lcdEndpoint, address, apiEndpoint, isFullTier]);

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_TYPE, apiEndpoint, lcdEndpoint, address],
    queryFn,
    {
      ...options,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAccountBech32 = (
  endpoint: string
): UseQueryResult<AccountBech32LcdResponse> =>
  useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_BECH_32_LCD, endpoint],
    async () => getAccountBech32Lcd(endpoint),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
