import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useLCDEndpoint } from "lib/app-provider";

import type { RawValidator } from "./validator";
import { getValidators } from "./validator";

export const useValidators = (): UseQueryResult<
  Record<string, RawValidator>
> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getValidators(lcdEndpoint),
    [lcdEndpoint]
  );

  return useQuery(["query", "validators", lcdEndpoint], queryFn, {
    refetchOnWindowFocus: false,
  });
};
