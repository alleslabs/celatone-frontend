import { z } from "zod";

import { zHexAddr, zPagination } from "lib/types";
import { snakeToCamel } from "lib/utils";

const zResourcesResponseItem = z
  .object({
    address: zHexAddr,
    move_resource: z.string(),
    raw_bytes: z.string(),
    struct_tag: z.string(),
  })
  .transform(snakeToCamel);
export type ResourceResponseItem = z.infer<typeof zResourcesResponseItem>;

export const zResourcesResponseRest = z.object({
  resources: z.array(zResourcesResponseItem),
  pagination: zPagination,
});

export const zResourcesResponse = z.object({
  items: z.array(zResourcesResponseItem),
  total: z.number().nonnegative(),
});
export type ResourceResponse = z.infer<typeof zResourcesResponse>;
