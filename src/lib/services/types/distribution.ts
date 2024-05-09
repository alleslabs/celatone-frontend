import { z } from "zod";

import { zCoin, zValidatorAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";

export const zDelegationRewardsResponse = z
  .object({
    rewards: z.array(
      z.object({
        validator_address: zValidatorAddr,
        reward: z.array(zCoin),
      })
    ),
    total: z.array(zCoin),
  })
  .transform(snakeToCamel);
export type DelegationRewardsResponse = z.infer<
  typeof zDelegationRewardsResponse
>;

export const zCommissionResponse = z.object({
  commission: z.object({
    commission: z.array(zCoin),
  }),
});
export type CommissionResponse = z.infer<typeof zCommissionResponse>;
