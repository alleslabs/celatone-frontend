import { useQuery } from "@tanstack/react-query";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

import { getRichlistSequencer } from "./sequencer";

export const useRichlistSequencer = (
  denom: string,
  limit = 10,
  offset = 0,
  reverse = true,
  enabled = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery({
    enabled,
    queryKey: [
      CELATONE_QUERY_KEYS.RICHLIST_SEQUENCER,
      indexerEndpoint,
      denom,
      limit,
      offset,
      reverse,
    ],
    queryFn: () =>
      getRichlistSequencer({
        denom,
        endpoint: indexerEndpoint,
        limit,
        offset,
        reverse,
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });
};
