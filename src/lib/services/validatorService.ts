import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useLCDEndpoint } from "lib/app-provider";
import type { Option, ValidatorAddr } from "lib/types";

import type { RawValidator } from "./validator";
import { getValidator, getValidators } from "./validator";

export const useValidator = (
  validatorAddr: Option<ValidatorAddr>,
  enabled = true
): UseQueryResult<RawValidator> => {
  const endpoint = useLCDEndpoint();
  const queryFn = async ({ queryKey }: QueryFunctionContext<string[]>) =>
    getValidator(queryKey[2], queryKey[3] as ValidatorAddr);

  return useQuery(
    ["query", "validator", endpoint, validatorAddr] as string[],
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
  const endpoint = useLCDEndpoint();
  const queryFn = useCallback(async () => getValidators(endpoint), [endpoint]);

  return useQuery(["query", "validators", endpoint], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
