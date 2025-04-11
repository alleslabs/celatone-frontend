import { snakeToCamel } from "lib/utils";
import { z } from "zod";

import { zAddr } from "./addrs";

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
      address: zAddr,
    }),
  })
  .transform((val) => val.data);

export type AddressByIcnsName = z.infer<typeof zAddressByIcnsName>;
