import { useInfiniteQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { BechAddr32 } from "lib/types";

import { getContractStates } from "./contractState";

export const useContractStates = (
  contractAddress: BechAddr32,
  numStatesToLoad: number
) => {
  const baseEndpoint = useBaseApiRoute("contracts");

  return useInfiniteQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_STATES,
      baseEndpoint,
      contractAddress,
      numStatesToLoad,
    ],
    ({ pageParam }) =>
      getContractStates(
        baseEndpoint,
        contractAddress,
        numStatesToLoad,
        pageParam
      ),
    {
      getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
};
