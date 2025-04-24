import { zCoin, zValidatorAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

export const zDelegationRewardsResponseRest = z
  .object({
    rewards: z.array(
      z.object({
        reward: z.array(zCoin),
        validator_address: zValidatorAddr,
      })
    ),
    total: z.array(zCoin),
  })
  .transform(snakeToCamel);

export const zCommissionsResponseRest = z.object({
  commission: z.object({
    commission: z.array(zCoin),
  }),
});
