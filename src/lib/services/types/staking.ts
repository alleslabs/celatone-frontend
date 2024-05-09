import { z } from "zod";

import { zAddr, zCoin, zUtcDate, zValidatorAddr } from "lib/types";
import { formatSeconds, snakeToCamel } from "lib/utils";

export const zStakingParamsResponse = z
  .object({
    params: z.object({
      unbonding_time: z.string(), // e.g. "1209600s"
      max_validators: z.number(),
      max_entries: z.number(),
      historical_entries: z.number(),
      bond_denoms: z.string(),
      min_commission_rate: z.string(),
      min_self_delegation: z.string(),
    }),
  })
  .transform(({ params }) => ({
    ...snakeToCamel(params),
    unbondingTime: formatSeconds(params.unbonding_time),
  }));
export type StakingParamsResponse = z.infer<typeof zStakingParamsResponse>;

export const zDelegationsResponse = z
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
export type DelegationsResponse = z.infer<typeof zDelegationsResponse>;

export const zUnbondingsResponse = z
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
export type UnbondingsResponse = z.infer<typeof zUnbondingsResponse>;

export const zRedelegationsResponse = z
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
