import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";

import type { RawValidator } from "./validator";
import { getValidators } from "./validator";

export const useValidators = (): UseQueryResult<
  Record<string, RawValidator>
> => {
  const lcdEndpoint = useBaseApiRoute("rest");

  const queryFn = useCallback(
    async () => getValidators(lcdEndpoint),
    [lcdEndpoint]
  );

  return useQuery([CELATONE_QUERY_KEYS.VALIDATORS, lcdEndpoint], queryFn, {
    refetchOnWindowFocus: false,
  });
};
