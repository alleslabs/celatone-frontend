import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useLCDEndpoint } from "lib/app-provider";

import type { RawValidator } from "./validator";
import { getValidators } from "./validator";

export const useValidators = (): UseQueryResult<
  Record<string, RawValidator>
> => {
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(async () => getValidators(endpoint), [endpoint]);

  return useQuery(["query", "validators", endpoint], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
