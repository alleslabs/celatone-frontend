import axios from "axios";

import { CURR_THEME } from "env";
import type { Option, ValidatorAddr, ValidatorInfo } from "lib/types";
import { removeSpecialChars } from "lib/utils";

interface ValidatorsResponse {
  validators: {
    operator_address: ValidatorAddr;
    consensus_pubkey: {
      "@type": string;
      key: string;
    };
    jailed: boolean;
    status: string;
    token: string;
    delegator_shares: string;
    description: {
      moniker: string;
      identity: string;
      website: string;
      security_contact: string;
      details: string;
    };
    unbonding_height: string;
    unbonding_time: string;
    commission: {
      commission_rates: {
        rate: string;
        max_rate: string;
        max_change_rate: string;
      };
      update_time: string;
    };
    min_self_delegation: string;
  }[];
}

export interface RawValidator {
  validatorAddress: ValidatorAddr;
  moniker: string;
  identity: string;
}

export const getValidators = async (
  endpoint: string
): Promise<Record<string, RawValidator>> => {
  const { data } = await axios.get<ValidatorsResponse>(
    `${endpoint}/cosmos/staking/v1beta1/validators?pagination.limit=500`
  );
  return data.validators.reduce<Record<string, RawValidator>>(
    (all, validator) => ({
      ...all,
      [validator.operator_address]: {
        validatorAddress: validator.operator_address,
        moniker: validator.description.moniker,
        identity: validator.description.identity,
      },
    }),
    {}
  );
};

export const resolveValIdentity = async (
  apiPath: Option<string>,
  validator: ValidatorInfo
): Promise<string> => {
  const githubUrl = `https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${apiPath}/moniker/${validator.validatorAddress}.png`;
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
          return data.them[0].pictures.primary.url;
        }
        return uiAvatarsUrl;
      })
  );
};
