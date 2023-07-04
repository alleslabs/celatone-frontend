import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useBaseApiRoute, useCurrentChain } from "lib/app-provider";
import type { ValidatorInfo } from "lib/types";

import type { RawValidator } from "./validator";
import { resolveValIdentity, getValidators } from "./validator";

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

export const useValidatorImage = (
  validator: ValidatorInfo | null
): UseQueryResult<string> => {
  const {
    chain: { chain_name: chainName },
  } = useCurrentChain();

  return useQuery({
    queryKey: [
      "query",
      "validator_identity",
      chainName,
      validator?.validatorAddress,
    ],
    queryFn: async () => {
      if (!validator) return Promise.resolve("");
      return resolveValIdentity(chainName, validator);
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!validator,
  });
};
