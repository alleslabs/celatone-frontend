import { z } from "zod";

import { snakeToCamel } from "lib/utils";

export const zICNSNamesByAddress = z
  .object({
    data: z.object({
      names: z.array(z.string()),
      primary_name: z.string(),
    }),
  })
  .transform((val) => snakeToCamel(val.data));

export type ICNSNamesByAddress = z.infer<typeof zICNSNamesByAddress>;

export const zAddressByICNSName = z
  .object({
    data: z.object({
      address: z.string(),
    }),
  })
  .transform((val) => val.data);

export type AddressByICNSName = z.infer<typeof zAddressByICNSName>;
