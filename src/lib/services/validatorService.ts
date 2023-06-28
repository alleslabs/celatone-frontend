import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useBaseApiRoute } from "lib/app-provider";

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

  return useQuery(["query", "validators", lcdEndpoint], queryFn, {
    refetchOnWindowFocus: false,
  });
};
