import { useInfiniteQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useLcdEndpoint } from "lib/app-provider";
import type { BechAddr32 } from "lib/types";

import { getContractStatesLcd } from "./lcd";

export const useContractStatesLcd = (
  contractAddress: BechAddr32,
  numStatesToLoad: number
) => {
  const lcdEndpoint = useLcdEndpoint();

  return useInfiniteQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_STATES_LCD,
      lcdEndpoint,
      contractAddress,
      numStatesToLoad,
    ],
    ({ pageParam }) =>
      getContractStatesLcd(
        lcdEndpoint,
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
