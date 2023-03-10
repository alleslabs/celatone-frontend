import axios from "axios";

import type { Option, ValidatorAddr } from "lib/types";

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
): Promise<Option<Record<string, RawValidator>>> => {
  const { data } = await axios.get<ValidatorsResponse>(
    `${endpoint}/cosmos/staking/v1beta1/validators?pagination.limit=500`
  );
  return data.validators.reduce(
    (all, validator) => ({
      ...all,
      [validator.operator_address]: {
        validatorAddress: validator.operator_address,
        moniker: validator.description.moniker,
        identity: validator.description.identity,
      },
    }),
    {} as Record<string, RawValidator>
  );
};
