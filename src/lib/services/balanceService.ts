import type { Coin } from "@cosmjs/stargate";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { Addr } from "lib/types";

import { getBalances } from "./balance";

export const useBalances = (address: Addr): UseQueryResult<Coin[]> => {
  const endpoint = useBaseApiRoute("balances");

  return useQuery(
    [CELATONE_QUERY_KEYS.BALANCES, endpoint, address],
    async () => getBalances(endpoint, address),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
  );
};
