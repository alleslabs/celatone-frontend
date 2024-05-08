import axios from "axios";

import type { Validator } from "lib/types";
import { removeSpecialChars } from "lib/utils";

export const resolveValIdentity = async (
  chainName: string,
  validator: Validator,
  bgColor: string
): Promise<string> => {
  const githubUrl = `https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${chainName}/moniker/${validator.validatorAddress}.png`;
  const keybaseUrl = `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${validator.identity}&fields=pictures`;
  const uiAvatarsUrl = `https://ui-avatars.com/api/?name=${removeSpecialChars(
    validator.moniker ?? ""
  )}&background=${bgColor.replace("#", "")}&color=fff`;

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
