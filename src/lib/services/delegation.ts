import axios from "axios";
import { z } from "zod";

import { zUtcDate, zValidator } from "lib/types";
import type { BechAddr } from "lib/types";
import { parseWithError, snakeToCamel } from "lib/utils";

const zDelegations = z
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

export type Delegations = z.infer<typeof zDelegations>;

export const getDelegationsByAddress = async (
  endpoint: string,
  address: BechAddr
): Promise<Delegations> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/delegations`)
    .then(({ data }) => parseWithError(zDelegations, data));
