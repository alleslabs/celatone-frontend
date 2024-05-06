import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

import { CURR_THEME } from "env";
import { CELATONE_QUERY_KEYS, useCurrentChain } from "lib/app-provider";
import type { Nullable, Validator } from "lib/types";
import { removeSpecialChars } from "lib/utils";

const resolveValIdentity = async (
  chainName: string,
  validator: Validator
): Promise<string> => {
  const githubUrl = `https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${chainName}/moniker/${validator.validatorAddress}.png`;
  const keybaseUrl = `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${validator.identity}&fields=pictures`;
  const uiAvatarsUrl = `https://ui-avatars.com/api/?name=${removeSpecialChars(
    validator.moniker ?? ""
  )}&background=${CURR_THEME.colors.secondary.main.replace("#", "")}&color=fff`;

  return (
    axios
      .get(githubUrl)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_) => githubUrl)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(async (_) => {
        if (validator.identity) {
          const { data } = await axios.get(keybaseUrl);
          if (data.them.length) return data.them[0].pictures.primary.url;
        }
        return uiAvatarsUrl;
      })
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
      CELATONE_QUERY_KEYS.VALIDATOR_IDENTITY,
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
