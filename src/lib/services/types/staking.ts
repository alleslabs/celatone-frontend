import { z } from "zod";

import { zAddr, zCoin, zUtcDate, zValidator, zValidatorAddr } from "lib/types";
import { formatSeconds, snakeToCamel } from "lib/utils";

export const zStakingParamsResponseLcd = z
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

export const zDelegationsResponseLcd = z
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

export const zUnbondingsResponseLcd = z
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

export const zRedelegationsResponseLcd = z
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
              share_dst: z.string(),
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
