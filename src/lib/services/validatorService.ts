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
import type { Nullable, Option, Validator, ValidatorAddr } from "lib/types";

import type {
  ValidatorDataResponse,
  ValidatorsResponse,
  ValidatorUptimeResponse,
} from "./validator";
import {
  getHistoricalPowers,
  getValidator,
  getValidatorData,
  getValidators,
  getValidatorUptime,
  resolveValIdentity,
} from "./validator";

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

export const useValidatorHistoricalPowers = (validatorAddr: ValidatorAddr) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery(
    [CELATONE_QUERY_KEYS.VALIDATOR_HISTORICAL_POWERS, endpoint],
    async () => getHistoricalPowers(endpoint, validatorAddr),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
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

export const useValidatorData = (validatorAddress: ValidatorAddr) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorDataResponse>(
    [CELATONE_QUERY_KEYS.VALIDATOR_DATA, endpoint, validatorAddress],
    async () => getValidatorData(endpoint, validatorAddress),
    {
      retry: 1,
    }
  );
};

export const useValidatorUptime = (
  validatorAddress: ValidatorAddr,
  blocks: number
) => {
  const endpoint = useBaseApiRoute("validators");

  return useQuery<ValidatorUptimeResponse>(
    [CELATONE_QUERY_KEYS.VALIDATOR_UPTIME, endpoint, validatorAddress],
    async () => getValidatorUptime(endpoint, validatorAddress, blocks),
    {
      retry: 1,
    }
  );
};
