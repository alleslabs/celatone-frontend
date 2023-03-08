import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type { Addr, Option, ValidatorAddr } from "lib/types";
import { parseDate, secondsToDays } from "lib/utils";

interface StakingParamsResponse {
  params: {
    unbonding_time: string; // e.g. "1209600s"
    max_validators: number;
    max_entries: number;
    historical_entries: number;
    bond_denom: string;
    min_commission_rate: string;
    min_self_delegation: string;
  };
}

interface DelegationResponse {
  delegation_responses: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string;
    };
    balance: Coin;
  }[];
}

interface UnbondingResponse {
  unbonding_responses: {
    delegator_address: string;
    validator_address: string;
    entries: {
      creation_height: string;
      completion_time: string;
      initial_balance: string;
      balance: string; // after slashed during unbonding
    }[];
  }[];
}

interface DelegationRewardsResponse {
  rewards: {
    validator_address: string;
    reward: Coin[];
  }[];
  total: Coin[];
}

interface CommissionResponse {
  commission: {
    commission: Coin[];
  };
}

export interface RawStakingParams {
  unbondingTime: string; // e.g. "14 days"
  maxEntries: number;
  bondDenom: string;
}

export interface RawDelegation {
  validatorAddress: ValidatorAddr;
  denom: string;
  amount: string;
}

export interface RawUnbonding {
  validatorAddress: ValidatorAddr;
  completionTime: Date;
  amount: string;
}

interface Reward {
  validatorAddress: ValidatorAddr;
  reward: Coin[];
}

export interface RawDelegationRewards {
  total: Coin[];
  rewards: Reward[];
}

export interface RawCommission {
  commission: Coin[];
}

export const getStakingParams = async (
  endpoint: string
): Promise<Option<RawStakingParams>> => {
  const { data } = await axios.get<StakingParamsResponse>(
    `${endpoint}/cosmos/staking/v1beta1/params`
  );
  return {
    unbondingTime: secondsToDays(data.params.unbonding_time.slice(0, -1)),
    maxEntries: data.params.max_entries,
    bondDenom: data.params.bond_denom,
  };
};

export const getDelegations = async (
  endpoint: string,
  address: Addr
): Promise<Option<RawDelegation[]>> => {
  const { data } = await axios.get<DelegationResponse>(
    `${endpoint}/cosmos/staking/v1beta1/delegations/${address}`
  );
  return data.delegation_responses.map<RawDelegation>((delegation) => ({
    validatorAddress: delegation.delegation.validator_address as ValidatorAddr,
    denom: delegation.balance.denom,
    amount: delegation.balance.amount,
  }));
};

export const getUnbondings = async (
  endpoint: string,
  address: Addr
): Promise<Option<RawUnbonding[]>> => {
  const { data } = await axios.get<UnbondingResponse>(
    `${endpoint}/cosmos/distribution/v1beta1/delegators/${address}/unbonding_delegations`
  );
  return data.unbonding_responses.reduce(
    (prev, validator) =>
      prev.concat(
        ...validator.entries.map((entry) => ({
          validatorAddress: validator.validator_address as ValidatorAddr,
          completionTime: parseDate(entry.completion_time),
          amount: entry.balance,
        }))
      ),
    [] as RawUnbonding[]
  );
};

export const getDelegationRewards = async (
  endpoint: string,
  address: Addr
): Promise<Option<RawDelegationRewards>> => {
  const { data } = await axios.get<DelegationRewardsResponse>(
    `${endpoint}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
  );
  return {
    total: data.total,
    rewards: data.rewards.map<Reward>((reward) => ({
      validatorAddress: reward.validator_address as ValidatorAddr,
      reward: reward.reward,
    })),
  };
};

export const getCommission = async (
  endpoint: string,
  address: ValidatorAddr
): Promise<Option<RawCommission>> => {
  const { data } = await axios.get<CommissionResponse>(
    `${endpoint}/cosmos/distribution/v1beta1/validators/${address}/commission`
  );
  return {
    commission: data.commission.commission,
  };
};
