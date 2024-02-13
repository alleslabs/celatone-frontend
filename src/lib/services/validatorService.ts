import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { ThemeConfig } from "config/theme/types";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
} from "lib/app-provider";
import type { Validator, ValidatorAddr, Nullable } from "lib/types";

import { resolveValIdentity, getValidator } from "./validator";

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
  validator: Nullable<Validator>,
  theme: ThemeConfig
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
      return resolveValIdentity(chainName, validator, theme);
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(validator),
  });
};
