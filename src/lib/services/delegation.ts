import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import {
  type Addr,
  type StakingShare,
  type ValidatorAddr,
  zUtcDate,
  zValidator,
} from "lib/types";
import { parseDate, formatSeconds, snakeToCamel } from "lib/utils";

interface StakingParamsResponse {
  params: {
    unbonding_time: string; // e.g. "1209600s"
    max_validators: number;
    max_entries: number;
    historical_entries: number;
    bond_denoms: string[];
    min_commission_rate: string;
    min_self_delegation?: string; // not in initia
    min_voting_power?: string; // only in initia
  };
}

interface DelegationResponse {
  delegation_responses: {
    delegation: {
      delegator_address: Addr;
      validator_address: ValidatorAddr;
      shares: StakingShare[];
    };
    balance: Coin[];
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
      balance: Coin[]; // after slashed during unbonding
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
        initial_balance: Coin[];
        share_dst: StakingShare[];
      };
      balance: Coin[];
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
  bondDenoms: string[];
}

export interface RawDelegation {
  validatorAddress: ValidatorAddr;
  balance: Coin[];
}

export interface RawUnbonding {
  validatorAddress: ValidatorAddr;
  completionTime: Date;
  balance: Coin[];
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
  dstValidatorAddress: ValidatorAddr;
  completionTime: Date;
  balance: Coin[];
}

export interface RawCommission {
  commission: Coin[];
}

export const getStakingParams = async (
  endpoint: string
): Promise<RawStakingParams> => {
  const { data } = await axios.get<StakingParamsResponse>(`${endpoint}/params`);

  return {
    unbondingTime: formatSeconds(data.params.unbonding_time),
    maxEntries: data.params.max_entries,
    bondDenoms: data.params.bond_denoms,
  };
};

export const getDelegations = async (
  endpoint: string,
  address: Addr
): Promise<RawDelegation[]> => {
  const { data } = await axios.get<DelegationResponse>(
    `${endpoint}/delegations/${address}`
  );
  return data.delegation_responses.map<RawDelegation>((delegation) => ({
    validatorAddress: delegation.delegation.validator_address as ValidatorAddr,
    balance: delegation.balance,
  }));
};

export const getUnbondings = async (
  endpoint: string,
  address: Addr
): Promise<RawUnbonding[]> => {
  const { data } = await axios.get<UnbondingResponse>(
    `${endpoint}/unbondings/${address}`
  );
  return data.unbonding_responses
    .map<RawUnbonding[]>((validator) =>
      validator.entries.map<RawUnbonding>((entry) => ({
        validatorAddress: validator.validator_address as ValidatorAddr,
        completionTime: parseDate(entry.completion_time),
        balance: entry.balance,
      }))
    )
    .flat()
    .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime());
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
    `${endpoint}/redelegations/${address}`
  );
  return data.redelegation_responses
    .map<RawRedelegation[]>((redelegate) =>
      redelegate.entries.map((entry) => ({
        srcValidatorAddress: redelegate.redelegation.validator_src_address,
        dstValidatorAddress: redelegate.redelegation.validator_dst_address,
        completionTime: parseDate(entry.redelegation_entry.completion_time),
        balance: entry.balance,
      }))
    )
    .flat()
    .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime());
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

const zAccountDelegations = z
  .object({
    is_validator: z.boolean(),
    commissions: z.array(
      z.object({
        amount: z.string(),
        denom: z.string(),
      })
    ),
    staking_params: z.object({
      bond_denoms: z.array(z.string()),
      max_entries: z.number(),
      unbonding_time: z.string(),
    }),
    delegations: z.array(
      z.object({
        balance: z.array(
          z.object({
            amount: z.string(),
            denom: z.string(),
          })
        ),
        validator: zValidator,
      })
    ),
    delegations_rewards: z.object({
      rewards: z.array(
        z.object({
          reward: z.array(
            z.object({
              amount: z.string(),
              denom: z.string(),
            })
          ),
          validator: zValidator,
        })
      ),
      total: z.array(
        z.object({
          amount: z.string(),
          denom: z.string(),
        })
      ),
    }),
    unbondings: z.array(
      z.object({
        entries: z.array(
          z.object({
            balance: z.array(
              z.object({
                amount: z.string(),
                denom: z.string(),
              })
            ),
            completion_time: zUtcDate,
          })
        ),
        validator: zValidator,
      })
    ),
    redelegations: z.array(
      z.object({
        entries: z.array(
          z.object({
            balance: z.array(
              z.object({
                amount: z.string(),
                denom: z.string(),
              })
            ),
            redelegation_entry: z.object({
              completion_time: zUtcDate,
            }),
          })
        ),
        validator_dst: zValidator,
        validator_src: zValidator,
      })
    ),
  })
  .transform((val) => ({
    isValidator: val.is_validator,
    commissions: val.commissions,
    stakingParams: snakeToCamel(val.staking_params),
    delegations: val.delegations.map((delegation) => ({
      balance: delegation.balance,
      validator: delegation.validator,
    })),
    delegationRewards: {
      rewards: val.delegations_rewards.rewards.map((reward) => ({
        reward: reward.reward,
        validator: reward.validator,
      })),
      total: val.delegations_rewards.total,
    },
    unbondings: val.unbondings
      .map((unbonding) =>
        unbonding.entries.map((entry) => ({
          validator: unbonding.validator,
          balance: entry.balance,
          completionTime: entry.completion_time,
        }))
      )
      .flat()
      // TODO: Use API to sort unbondings
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime()),
    redelegations: val.redelegations
      .map((redelegation) =>
        redelegation.entries.map((entry) => ({
          balance: entry.balance,
          completionTime: entry.redelegation_entry.completion_time,
          srcValidator: redelegation.validator_src,
          dstValidator: redelegation.validator_dst,
        }))
      )
      .flat()
      // TODO: Use API to sort redelegations
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime()),
  }));

export type AccountDelegations = z.infer<typeof zAccountDelegations>;

export const getAccountDelegations = async (
  endpoint: string,
  address: Addr
): Promise<AccountDelegations> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/delegations`)
    .then(({ data }) => zAccountDelegations.parse(data));
