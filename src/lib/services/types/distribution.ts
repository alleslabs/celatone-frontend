import { zCoin, zValidatorAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

export const zDelegationRewardsResponseRest = z
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

export const zCommissionsResponseRest = z.object({
  commission: z.object({
    commission: z.array(zCoin),
  }),
});
