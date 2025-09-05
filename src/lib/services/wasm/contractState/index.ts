import type { BechAddr32 } from "lib/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";

import { getContractStatesRest } from "./rest";

export const useContractStatesRest = (
  contractAddress: BechAddr32,
  numStatesToLoad: number
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_STATES_REST,
      restEndpoint,
      contractAddress,
      numStatesToLoad,
    ],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getContractStatesRest(
        restEndpoint,
        contractAddress,
        numStatesToLoad,
        pageParam
      ),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });
};
