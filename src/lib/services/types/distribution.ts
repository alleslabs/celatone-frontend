import { z } from "zod";

import { zCoin, zValidatorAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";

export const zDelegationRewardsResponseLcd = z
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

export const zCommissionsResponseLcd = z.object({
  commission: z.object({
    commission: z.array(zCoin),
  }),
});
