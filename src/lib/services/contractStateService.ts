import { useInfiniteQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { ContractAddr } from "lib/types";

import { getContractStates } from "./contractState";

export const useContractStates = (contractAddress: ContractAddr) => {
  const baseEndpoint = useBaseApiRoute("rest");

  return useInfiniteQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_STATE, baseEndpoint, contractAddress],
    ({ pageParam }) =>
      getContractStates(baseEndpoint, contractAddress, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.nextKey) {
          return lastPage.nextKey;
        }

        return false; // No more pages
      },
      refetchOnWindowFocus: false,
    }
  );
};
