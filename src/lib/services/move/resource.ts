import axios from "axios";
import { z } from "zod";

import { type MoveAccountAddr, zMoveAccountAddr } from "lib/types";

const zResourcesResponseItem = z
  .object({
    address: zMoveAccountAddr,
    move_resource: z.string(),
    raw_bytes: z.string(),
    struct_tag: z.string(),
  })
  .transform((val) => ({
    address: val.address,
    moveResource: val.move_resource,
    rawBytes: val.raw_bytes,
    structTag: val.struct_tag,
  }));

const zResourcesResponse = z.object({
  items: z.array(zResourcesResponseItem),
  total: z.number().nonnegative(),
});
export type ResourceResponse = z.infer<typeof zResourcesResponse>;

export const getAccountResources = async (
  endpoint: string,
  address: MoveAccountAddr
): Promise<ResourceResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/move/resources`)
    .then(({ data }) => zResourcesResponse.parse(data));
