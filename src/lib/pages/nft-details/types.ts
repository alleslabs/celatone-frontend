import { zHexAddr32 } from "lib/types";
import { z } from "zod";

export const zNftDetailQueryParams = z.object({
  collectionAddress: zHexAddr32,
  nftAddress: zHexAddr32,
});
export type NftDetailQueryParams = z.infer<typeof zNftDetailQueryParams>;
