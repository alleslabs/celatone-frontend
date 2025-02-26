import { useInfiniteQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type { BechAddr32 } from "lib/types";

import { getContractStatesRest } from "./rest";

export const useContractStatesRest = (
  contractAddress: BechAddr32,
  numStatesToLoad: number
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useInfiniteQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_STATES_REST,
      restEndpoint,
      contractAddress,
      numStatesToLoad,
    ],
    ({ pageParam }) =>
      getContractStatesRest(
        restEndpoint,
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
