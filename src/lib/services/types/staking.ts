import { z } from "zod";

import {
  zAddr,
  zBechAddr,
  zBig,
  zCoin,
  zUtcDate,
  zValidator,
  zValidatorAddr,
} from "lib/types";
import { formatSeconds, snakeToCamel } from "lib/utils";

export const zStakingParamsResponseRest = z
  .object({
    params: z.object({
      unbonding_time: z.string().transform((val) => formatSeconds(val)), // e.g. "1209600s"
      max_validators: z.number(),
      max_entries: z.number(),
      historical_entries: z.number(),
      bond_denom: z.string(),
      min_commission_rate: z.string(),
    }),
  })
  .transform(snakeToCamel);

export const zDistributionParamsResponseRest = z
  .object({
    params: z.object({
      community_tax: zBig,
      base_proposer_reward: zBig,
      bonus_proposer_reward: zBig,
      withdraw_addr_enabled: z.boolean(),
    }),
  })
  .transform(snakeToCamel);

export const zAnnualProvisionsResponseRest = z
  .object({
    annual_provisions: zBig,
  })
  .transform(snakeToCamel);

export const zMintParamsResponseRest = z
  .object({
    params: z.object({
      mint_denom: z.string(),
      genesis_epoch_provisions: zBig,
      epoch_identifier: z.string(),
      reduction_period_in_epochs: zBig,
      reduction_factor: zBig,
      distribution_proportions: z.object({
        staking: zBig,
        pool_incentives: zBig,
        developer_rewards: zBig,
        community_pool: zBig,
      }),
      weighted_developer_rewards_receivers: z.array(
        z.object({
          address: zBechAddr,
          weight: zBig,
        })
      ),
      minting_rewards_distribution_start_epoch: zBig,
    }),
  })
  .transform(snakeToCamel);

export const zEpochProvisionsResponseRest = z
  .object({
    epoch_provisions: zBig,
  })
  .transform(snakeToCamel);

export const zDelegationsResponseRest = z
  .object({
    delegation_responses: z.array(
      z.object({
        delegation: z.object({
          delegator_address: zAddr,
          validator_address: zValidatorAddr,
          shares: z.string(),
        }),
        balance: zCoin,
      })
    ),
  })
  .transform(snakeToCamel);

export const zUnbondingsResponseRest = z
  .object({
    unbonding_responses: z.array(
      z.object({
        delegator_address: zAddr,
        validator_address: zValidatorAddr,
        entries: z.array(
          z.object({
            creation_height: z.coerce.number(),
            completion_time: zUtcDate,
            initial_balance: z.string(),
            balance: z.string(), // after slashed during unbonding
          })
        ),
      })
    ),
  })
  .transform(snakeToCamel);

export const zRedelegationsResponseRest = z
  .object({
    redelegation_responses: z.array(
      z.object({
        redelegation: z.object({
          delegator_address: zAddr,
          validator_src_address: zValidatorAddr,
          validator_dst_address: zValidatorAddr,
        }),
        entries: z.array(
          z.object({
            redelegation_entry: z.object({
              creation_height: z.coerce.number(),
              completion_time: zUtcDate,
              initial_balance: z.string(),
              shares_dst: z.string(),
            }),
            balance: z.string(),
          })
        ),
      })
    ),
  })
  .transform(snakeToCamel);

export const zDelegationData = z
  .object({
    is_validator: z.boolean(),
    commissions: z.array(zCoin),
    staking_params: z.object({
      bond_denoms: z.array(z.string()),
      max_entries: z.number(),
      unbonding_time: z.string().transform((val) => formatSeconds(val)),
    }),
    delegations: z.array(
      z.object({
        balance: z.array(zCoin),
        validator: zValidator,
      })
    ),
    delegation_rewards: z.object({
      rewards: z.array(
        z.object({
          reward: z.array(zCoin),
          validator: zValidator,
        })
      ),
      total: z.array(zCoin),
    }),
    unbondings: z.array(
      z.object({
        entries: z.array(
          z.object({
            balance: z.array(zCoin),
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
            balance: z.array(zCoin),
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
    ...snakeToCamel(val),
    unbondings: val.unbondings
      .flatMap((unbonding) =>
        unbonding.entries.map((entry) => ({
          validator: unbonding.validator,
          balance: entry.balance,
          completionTime: entry.completion_time,
        }))
      )
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime()),
    redelegations: val.redelegations
      .flatMap((redelegation) =>
        redelegation.entries.map((entry) => ({
          balance: entry.balance,
          completionTime: entry.redelegation_entry.completion_time,
          srcValidator: redelegation.validator_src,
          dstValidator: redelegation.validator_dst,
        }))
      )
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime()),
  }));
export type DelegationData = z.infer<typeof zDelegationData>;
