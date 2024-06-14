import { z } from "zod";

import { snakeToCamel } from "lib/utils";

export const zIcnsNamesByAddress = z
  .object({
    data: z.object({
      names: z.array(z.string()),
      primary_name: z.string(),
    }),
  })
  .transform((val) => snakeToCamel(val.data));

export type IcnsNamesByAddress = z.infer<typeof zIcnsNamesByAddress>;

export const zAddressByIcnsName = z
  .object({
    data: z.object({
      address: z.string(),
    }),
  })
  .transform((val) => val.data);

export type AddressByIcnsName = z.infer<typeof zAddressByIcnsName>;
