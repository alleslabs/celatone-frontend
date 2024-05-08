import axios from "axios";
import { z } from "zod";

import type { Addr } from "lib/types";
import { zHexAddr } from "lib/types";
import { parseWithError, snakeToCamel } from "lib/utils";

const zResourcesResponseItem = z
  .object({
    address: zHexAddr,
    move_resource: z.string(),
    raw_bytes: z.string(),
    struct_tag: z.string(),
  })
  .transform(snakeToCamel);

const zResourcesResponse = z.object({
  items: z.array(zResourcesResponseItem),
  total: z.number().nonnegative(),
});
export type ResourceResponse = z.infer<typeof zResourcesResponse>;

export const getAccountResources = async (
  endpoint: string,
  address: Addr
): Promise<ResourceResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/move/resources`)
    .then(({ data }) => parseWithError(zResourcesResponse, data));
