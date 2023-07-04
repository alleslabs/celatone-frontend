import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useBaseApiRoute } from "lib/app-provider";
import type { Option, ValidatorAddr } from "lib/types";

import type { RawValidator } from "./validator";
import { getValidator, getValidators } from "./validator";

export const useValidator = (
  validatorAddr: Option<ValidatorAddr>,
  enabled = true
): UseQueryResult<RawValidator> => {
  const lcdEndpoint = useBaseApiRoute("rest");
  const queryFn = async ({ queryKey }: QueryFunctionContext<string[]>) =>
    getValidator(queryKey[2], queryKey[3] as ValidatorAddr);

  return useQuery(
    ["query", "validator", lcdEndpoint, validatorAddr] as string[],
    queryFn,
    {
      enabled: enabled && !!validatorAddr,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

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
