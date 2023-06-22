import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import big from "big.js";

import type { Addr, Token, U, ValidatorAddr } from "lib/types";
import { parseDate, formatSeconds } from "lib/utils";

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
      delegator_address: Addr;
      validator_address: ValidatorAddr;
      shares: string;
    };
    balance: Coin;
  }[];
}

interface UnbondingResponse {
  unbonding_responses: {
    delegator_address: Addr;
    validator_address: ValidatorAddr;
    entries: {
      creation_height: string;
      completion_time: string;
      initial_balance: string;
      balance: U<Token>; // after slashed during unbonding
    }[];
  }[];
}

interface DelegationRewardsResponse {
  rewards: {
    validator_address: ValidatorAddr;
    reward: Coin[];
  }[];
  total: Coin[];
}

interface RedelegationsResponse {
  redelegation_responses: {
    redelegation: {
      delegator_address: Addr;
      validator_src_address: ValidatorAddr;
      validator_dst_address: ValidatorAddr;
    };
    entries: {
      redelegation_entry: {
        creation_height: number;
        completion_time: string;
        initial_balance: string;
        share_dst: string;
      };
      balance: U<Token>;
    }[];
  }[];
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
  identity: string;
  denom: string;
  amount: string;
}

export interface RawUnbonding {
  validatorAddress: ValidatorAddr;
  identity: string;
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

export interface RawRedelegation {
  srcValidatorAddress: ValidatorAddr;
  srcIdentity: string;
  dstValidatorAddress: ValidatorAddr;
  dstIdentity: string;
  completionTime: Date;
  amount: string;
}

export interface RawCommission {
  commission: Coin[];
}

export const getStakingParams = async (
  endpoint: string
): Promise<RawStakingParams> => {
  const { data } = await axios.get<StakingParamsResponse>(
    `${endpoint}/cosmos/staking/v1beta1/params`
  );
  return {
    unbondingTime: formatSeconds(data.params.unbonding_time),
    maxEntries: data.params.max_entries,
    bondDenom: data.params.bond_denom,
  };
};

export const getDelegations = async (
  endpoint: string,
  address: Addr
): Promise<RawDelegation[]> => {
  const { data } = await axios.get<DelegationResponse>(
    `${endpoint}/cosmos/staking/v1beta1/delegations/${address}`
  );
  return Promise.all(
    data.delegation_responses.map<Promise<RawDelegation>>(
      async (delegation) => {
        const { data: valInfo } = await axios.get(
          `${endpoint}/cosmos/staking/v1beta1/validators/${delegation.delegation.validator_address}`
        );
        return {
          validatorAddress: delegation.delegation
            .validator_address as ValidatorAddr,
          identity: valInfo.validator.description.identity as string,
          denom: delegation.balance.denom,
          amount: delegation.balance.amount,
        };
      }
    )
  ).then((delegations) =>
    delegations.sort((a, b) => big(b.amount).cmp(a.amount))
  );
};

export const getUnbondings = async (
  endpoint: string,
  address: Addr
): Promise<RawUnbonding[]> => {
  const { data } = await axios.get<UnbondingResponse>(
    `${endpoint}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`
  );
  return Promise.all(
    data.unbonding_responses.map<Promise<RawUnbonding[]>>(async (validator) => {
      const { data: valInfo } = await axios.get(
        `${endpoint}/cosmos/staking/v1beta1/validators/${validator.validator_address}`
      );
      return validator.entries.map<RawUnbonding>((entry) => ({
        validatorAddress: validator.validator_address as ValidatorAddr,
        identity: valInfo.validator.description.identity as string,
        completionTime: parseDate(entry.completion_time),
        amount: entry.balance,
      }));
    })
  ).then((unbondings) =>
    unbondings
      .flat()
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
  );
};

export const getDelegationRewards = async (
  endpoint: string,
  address: Addr
): Promise<RawDelegationRewards> => {
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

export const getRedelegations = async (
  endpoint: string,
  address: Addr
): Promise<RawRedelegation[]> => {
  const { data } = await axios.get<RedelegationsResponse>(
    `${endpoint}/cosmos/staking/v1beta1/delegators/${address}/redelegations`
  );
  return Promise.all(
    data.redelegation_responses.map<Promise<RawRedelegation[]>>(
      async (redelegate) => {
        const [{ data: srcValInfo }, { data: dstValInfo }] = await Promise.all([
          axios.get(
            `${endpoint}/cosmos/staking/v1beta1/validators/${redelegate.redelegation.validator_src_address}`
          ),
          axios.get(
            `${endpoint}/cosmos/staking/v1beta1/validators/${redelegate.redelegation.validator_dst_address}`
          ),
        ]);
        return redelegate.entries.map((entry) => ({
          srcValidatorAddress: redelegate.redelegation.validator_src_address,
          srcIdentity: srcValInfo.validator.description.identity as string,
          dstValidatorAddress: redelegate.redelegation.validator_dst_address,
          dstIdentity: dstValInfo.validator.description.identity as string,
          completionTime: parseDate(entry.redelegation_entry.completion_time),
          amount: entry.balance,
        }));
      }
    )
  ).then((redelegations) =>
    redelegations
      .flat()
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
  );
};

export const getCommission = async (
  endpoint: string,
  address: ValidatorAddr
): Promise<RawCommission> => {
  const { data } = await axios.get<CommissionResponse>(
    `${endpoint}/cosmos/distribution/v1beta1/validators/${address}/commission`
  );
  return {
    commission: data.commission.commission,
  };
};
