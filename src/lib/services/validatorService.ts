import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { getChainApiPath } from "env";
import { useLCDEndpoint } from "lib/app-provider";
import type { ValidatorInfo } from "lib/types";

import type { RawValidator } from "./validator";
import { resolveValIdentity, getValidators } from "./validator";

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

export const useValidatorImage = (
  validator: ValidatorInfo | null
): UseQueryResult<string> => {
  const { currentChainName } = useWallet();
  return useQuery({
    queryKey: [
      "query",
      "validator_identity",
      currentChainName,
      validator?.validatorAddress,
    ],
    queryFn: async () => {
      if (!validator) return Promise.resolve("");
      return resolveValIdentity(getChainApiPath(currentChainName), validator);
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!validator,
  });
};
