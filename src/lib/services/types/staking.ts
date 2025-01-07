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

export const zStakingParamsResponseLcd = z
  .object({
    params: z.object({
      bond_denom: z.string(),
      historical_entries: z.number(),
      max_entries: z.number(),
      max_validators: z.number(),
      min_commission_rate: z.string(),
      unbonding_time: z.string().transform((val) => formatSeconds(val)), // e.g. "1209600s"
    }),
  })
  .transform(snakeToCamel);

export const zDistributionParamsResponseLcd = z
  .object({
    params: z.object({
      base_proposer_reward: zBig,
      bonus_proposer_reward: zBig,
      community_tax: zBig,
      withdraw_addr_enabled: z.boolean(),
    }),
  })
  .transform(snakeToCamel);

export const zAnnualProvisionsResponseLcd = z
  .object({
    annual_provisions: zBig,
  })
  .transform(snakeToCamel);

export const zMintParamsResponseLcd = z
  .object({
    params: z.object({
      distribution_proportions: z.object({
        community_pool: zBig,
        developer_rewards: zBig,
        pool_incentives: zBig,
        staking: zBig,
      }),
      epoch_identifier: z.string(),
      genesis_epoch_provisions: zBig,
      mint_denom: z.string(),
      minting_rewards_distribution_start_epoch: zBig,
      reduction_factor: zBig,
      reduction_period_in_epochs: zBig,
      weighted_developer_rewards_receivers: z.array(
        z.object({
          address: zBechAddr,
          weight: zBig,
        })
      ),
    }),
  })
  .transform(snakeToCamel);

export const zEpochProvisionsResponseLcd = z
  .object({
    epoch_provisions: zBig,
  })
  .transform(snakeToCamel);

export const zDelegationsResponseLcd = z
  .object({
    delegation_responses: z.array(
      z.object({
        balance: zCoin,
        delegation: z.object({
          delegator_address: zAddr,
          shares: z.string(),
          validator_address: zValidatorAddr,
        }),
      })
    ),
  })
  .transform(snakeToCamel);

export const zUnbondingsResponseLcd = z
  .object({
    unbonding_responses: z.array(
      z.object({
        delegator_address: zAddr,
        entries: z.array(
          z.object({
            balance: z.string(), // after slashed during unbonding
            completion_time: zUtcDate,
            creation_height: z.coerce.number(),
            initial_balance: z.string(),
          })
        ),
        validator_address: zValidatorAddr,
      })
    ),
  })
  .transform(snakeToCamel);

export const zRedelegationsResponseLcd = z
  .object({
    redelegation_responses: z.array(
      z.object({
        entries: z.array(
          z.object({
            balance: z.string(),
            redelegation_entry: z.object({
              completion_time: zUtcDate,
              creation_height: z.coerce.number(),
              initial_balance: z.string(),
              shares_dst: z.string(),
            }),
          })
        ),
        redelegation: z.object({
          delegator_address: zAddr,
          validator_dst_address: zValidatorAddr,
          validator_src_address: zValidatorAddr,
        }),
      })
    ),
  })
  .transform(snakeToCamel);

export const zDelegationData = z
  .object({
    commissions: z.array(zCoin),
    delegation_rewards: z.object({
      rewards: z.array(
        z.object({
          reward: z.array(zCoin),
          validator: zValidator,
        })
      ),
      total: z.array(zCoin),
    }),
    delegations: z.array(
      z.object({
        balance: z.array(zCoin),
        validator: zValidator,
      })
    ),
    is_validator: z.boolean(),
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
    staking_params: z.object({
      bond_denoms: z.array(z.string()),
      max_entries: z.number(),
      unbonding_time: z.string().transform((val) => formatSeconds(val)),
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
  })
  .transform((val) => ({
    ...snakeToCamel(val),
    redelegations: val.redelegations
      .flatMap((redelegation) =>
        redelegation.entries.map((entry) => ({
          balance: entry.balance,
          completionTime: entry.redelegation_entry.completion_time,
          dstValidator: redelegation.validator_dst,
          srcValidator: redelegation.validator_src,
        }))
      )
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime()),
    unbondings: val.unbondings
      .flatMap((unbonding) =>
        unbonding.entries.map((entry) => ({
          balance: entry.balance,
          completionTime: entry.completion_time,
          validator: unbonding.validator,
        }))
      )
      .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime()),
  }));
export type DelegationData = z.infer<typeof zDelegationData>;
