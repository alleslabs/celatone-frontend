import axios from "axios";

import type { ValidatorAddr } from "lib/types";

interface ValidatorResponse {
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
}

export interface RawValidator {
  validatorAddress: ValidatorAddr;
  moniker: string;
  identity: string;
}

export const getValidator = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
): Promise<RawValidator> => {
  const { data } = await axios.get<{ validator: ValidatorResponse }>(
    `${endpoint}/cosmos/staking/v1beta1/validators/${validatorAddr}`
  );
  return {
    validatorAddress: data.validator.operator_address,
    moniker: data.validator.description.moniker,
    identity: data.validator.description.identity,
  };
};

export const getValidators = async (
  endpoint: string
): Promise<Record<string, RawValidator>> => {
  const { data } = await axios.get<{ validators: ValidatorResponse[] }>(
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
