import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { AccountData, AccountTableCounts } from "../types";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useLcdEndpoint,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import type { BechAddr } from "lib/types";

import { getAccountData, getAccountTableCounts } from "./api";
import { getAccountDataLcd } from "./lcd";

export const useAccountData = (
  address: BechAddr
): UseQueryResult<AccountData> => {
  const isFullTier = useTierConfig() === "full";
  const lcdEndpoint = useLcdEndpoint();
  const apiEndpoint = useBaseApiRoute("accounts");
  const endpoint = isFullTier ? lcdEndpoint : apiEndpoint;

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

export * from "./gql";
