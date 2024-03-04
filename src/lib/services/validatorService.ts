import type {
  QueryFunctionContext,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
} from "lib/app-provider";
import type { Validator, ValidatorAddr, Nullable, Option } from "lib/types";

import type { ValidatorsResponse } from "./validator";
import { resolveValIdentity, getValidator, getValidators } from "./validator";

export const useValidator = (
  validatorAddr: ValidatorAddr,
  enabled = true
): UseQueryResult<Validator> => {
  const lcdEndpoint = useBaseApiRoute("staking");
  const queryFn = async ({ queryKey }: QueryFunctionContext<string[]>) =>
    getValidator(queryKey[1], queryKey[2] as ValidatorAddr);

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

export const useValidatorImage = (
  validator: Nullable<Validator>
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

export const useValidators = (
  limit: number,
  offset: number,
  isActive: boolean,
  sortBy: string,
  isDesc: boolean,
  search: Option<string>,
  options?: Pick<UseQueryOptions<ValidatorsResponse>, "onSuccess">
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorsResponse>(
    [
      CELATONE_QUERY_KEYS.VALIDATORS,
      endpoint,
      limit,
      offset,
      isActive,
      sortBy,
      isDesc,
      search,
    ],
    async () =>
      getValidators(endpoint, limit, offset, isActive, sortBy, isDesc, search),
    {
      retry: 1,
      ...options,
    }
  );
};
