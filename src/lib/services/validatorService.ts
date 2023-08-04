import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
  useCelatoneApp,
} from "lib/app-provider";
import { getValidators } from "lib/query/validator";
import type { ValidatorInfo, Validator, ValidatorAddr } from "lib/types";

import { resolveValIdentity, getValidator } from "./validator";

export const useValidator = (
  validatorAddr: ValidatorAddr,
  enabled = true
): UseQueryResult<Validator> => {
  const lcdEndpoint = useBaseApiRoute("rest");
  const queryFn = async ({ queryKey }: QueryFunctionContext<string[]>) =>
    getValidator(queryKey[2], queryKey[3] as ValidatorAddr);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_INFO_BY_ADDRESS,
      lcdEndpoint,
      validatorAddr,
    ] as string[],
    queryFn,
    {
      enabled: enabled && Boolean(validatorAddr),
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

  return useQuery(
    [CELATONE_QUERY_KEYS.VALIDATORS, indexerGraphClient],
    queryFn,
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useValidatorImage = (
  validator: ValidatorInfo | null
): UseQueryResult<string> => {
  const {
    chain: { chain_name: chainName },
  } = useCurrentChain();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.VALIDATOR_IDENTITY_BY_ADDRESS,
      chainName,
      validator?.validatorAddress,
      validator?.identity,
      validator?.moniker,
    ],
    queryFn: async () => {
      if (!validator) return Promise.resolve("");
      return resolveValIdentity(chainName, validator);
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(validator),
  });
};
