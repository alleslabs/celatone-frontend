import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useBaseApiRoute, useCelatoneApp } from "lib/app-provider";
import { getValidators } from "lib/query/validator";
import type { Validator, ValidatorAddr } from "lib/types";

import { getValidator } from "./validator";

export const useValidator = (
  validatorAddr: ValidatorAddr,
  enabled = true
): UseQueryResult<Validator> => {
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
  Record<ValidatorAddr, Validator>
> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient.request(getValidators).then(({ validators }) =>
      validators.reduce<Record<ValidatorAddr, Validator>>(
        (all, validator) => ({
          ...all,
          [validator.operator_address]: {
            validatorAddress: validator.operator_address,
            moniker: validator.moniker,
            identity: validator.identity,
          } as Validator,
        }),
        {}
      )
    );
  }, [indexerGraphClient]);

  return useQuery(["query", "validators", indexerGraphClient], queryFn, {
    refetchOnWindowFocus: false,
  });
};
